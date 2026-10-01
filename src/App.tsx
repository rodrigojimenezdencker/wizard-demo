import { useId, useMemo, useState } from 'react'
import './index.css'

type Data = { studio: string; email: string; city: string; plan: 'starter' | 'pro'; classes: string; staff: string }
const empty: Data = { studio: '', email: '', city: '', plan: 'starter', classes: '', staff: '' }
const steps = ['Studio', 'Plan', 'Data', 'Review'] as const

function validate(step: number, d: Data) {
  const e: Partial<Record<keyof Data, string>> = {}
  if (step === 0) {
    if (d.studio.trim().length < 2) e.studio = 'Enter the studio name'
    if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = 'Enter a valid email'
    if (!d.city.trim()) e.city = 'Enter a city'
  }
  if (step === 2) {
    if (d.classes && !/^\d+$/.test(d.classes)) e.classes = 'Numbers only'
    if (d.staff && !/^\d+$/.test(d.staff)) e.staff = 'Numbers only'
  }
  return e
}

function Field(p: { label: string; value: string; error?: string; onChange: (v: string) => void; type?: string; hint?: string }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{p.label}</label>
      <input id={id} type={p.type ?? 'text'} value={p.value} aria-invalid={!!p.error}
        aria-describedby={p.error ? id + '-e' : undefined} onChange={(e) => p.onChange(e.target.value)} />
      {p.hint && !p.error && <small>{p.hint}</small>}
      {p.error && <small id={id + '-e'} role="alert" className="err">{p.error}</small>}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(() => Number(localStorage.getItem('step') ?? 0))
  const [d, setD] = useState<Data>(() => JSON.parse(localStorage.getItem('data') ?? 'null') ?? empty)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(false)
  const errors = useMemo(() => validate(step, d), [step, d])
  const set = (k: keyof Data) => (v: string) => {
    const n = { ...d, [k]: v }; setD(n); localStorage.setItem('data', JSON.stringify(n))
  }
  const go = (n: number) => { setStep(n); setShown(false); localStorage.setItem('step', String(n)) }
  const next = () => (Object.keys(errors).length ? setShown(true) : go(step + 1))
  const err = (k: keyof Data) => (shown ? errors[k] : undefined)

  if (done) return (
    <main><h1>You are set up</h1><p>{d.studio} is ready on the {d.plan} plan.</p>
      <button onClick={() => { localStorage.clear(); setD(empty); setDone(false); go(0) }}>Start over</button></main>
  )
  return (
    <main>
      <h1>Set up your studio</h1>
      <ol className="steps" aria-label="Progress">
        {steps.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : ''}>{s}</li>)}
      </ol>
      <form onSubmit={(e) => { e.preventDefault(); step === 3 ? setDone(true) : next() }} noValidate>
        {step === 0 && <>
          <Field label="Studio name" value={d.studio} error={err('studio')} onChange={set('studio')} />
          <Field label="Contact email" type="email" value={d.email} error={err('email')} onChange={set('email')} />
          <Field label="City" value={d.city} error={err('city')} onChange={set('city')} />
        </>}
        {step === 1 && <fieldset><legend>Plan</legend>
          {(['starter', 'pro'] as const).map((p) => (
            <label key={p} className="radio"><input type="radio" name="plan" checked={d.plan === p} onChange={() => set('plan')(p)} />
              {p === 'starter' ? 'Starter - bookings and payments' : 'Pro - adds payroll and marketing'}</label>
          ))}</fieldset>}
        {step === 2 && <>
          <Field label="Classes per week" value={d.classes} error={err('classes')} onChange={set('classes')} hint="Optional" />
          <Field label="Staff members" value={d.staff} error={err('staff')} onChange={set('staff')} hint="Optional" />
        </>}
        {step === 3 && <dl>
          <dt>Studio</dt><dd>{d.studio}</dd><dt>Email</dt><dd>{d.email}</dd><dt>City</dt><dd>{d.city}</dd>
          <dt>Plan</dt><dd>{d.plan}</dd><dt>Classes / staff</dt><dd>{d.classes || '-'} / {d.staff || '-'}</dd></dl>}
        <div className="row">
          {step > 0 && <button type="button" className="ghost" onClick={() => go(step - 1)}>Back</button>}
          <button type="submit">{step === 3 ? 'Finish' : 'Continue'}</button>
        </div>
      </form>
    </main>
  )
}
