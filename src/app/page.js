"use client";

import { useState, useSyncExternalStore } from "react";

const accountKey = "whiskr-demo-account";
const sessionKey = "whiskr-demo-session";
const sessionListeners = new Set();
let cachedSessionRaw;
let cachedSession = null;

function getSession() {
  const savedUser = window.localStorage.getItem(sessionKey);
  if (savedUser === cachedSessionRaw) return cachedSession;
  cachedSessionRaw = savedUser;
  cachedSession = savedUser ? JSON.parse(savedUser) : null;
  return cachedSession;
}

function subscribeToSession(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

function notifySessionChange() {
  sessionListeners.forEach((listener) => listener());
}

export default function Home() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const user = useSyncExternalStore(subscribeToSession, getSession, () => null);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }

    const savedAccount = JSON.parse(window.localStorage.getItem(accountKey) || "null");
    if (mode === "signup") {
      if (!form.name.trim()) {
        setError("Tell us your name first.");
        return;
      }
      const account = { name: form.name.trim(), email, password: form.password };
      window.localStorage.setItem(accountKey, JSON.stringify(account));
      setMessage("Account created. You are now signed in.");
      signIn(account);
      return;
    }

    if (!savedAccount || savedAccount.email !== email || savedAccount.password !== form.password) {
      setError("We could not match those details. Create an account or try again.");
      return;
    }
    signIn(savedAccount);
  }

  function signIn(nextUser) {
    const session = { name: nextUser.name, email: nextUser.email };
    window.localStorage.setItem(sessionKey, JSON.stringify(session));
    notifySessionChange();
  }

  function signOut() {
    window.localStorage.removeItem(sessionKey);
    notifySessionChange();
    setForm({ name: "", email: "", password: "" });
    setMessage("");
  }

  if (user) {
    return (
      <main className="auth-shell signed-in-shell">
        <div className="welcome-panel">
          <img className="brand-logo" src="/whiskr-logo.png" alt="Whiskr" />
          <p className="eyebrow">You are in</p>
          <h1>Welcome home, {user.name.split(" ")[0]}.</h1>
          <p className="welcome-copy">Your corner of the internet for curious cats, cozy conversations, and very important naps.</p>
          <button className="primary-button" type="button" onClick={signOut}>Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel">
        <div className="brand-lockup"><img className="brand-logo" src="/whiskr-logo.png" alt="Whiskr" /><span>whiskr</span></div>
        <div className="brand-story">
          <p className="eyebrow">A softer social network</p>
          <h1>Find your people.<br /><em>Follow the purr.</em></h1>
          <p>Whiskr is a warm little place for cat people and the cats who tolerate them.</p>
        </div>
        <div className="cat-stamp" aria-hidden="true">✦<span>EST.<br />2026</span></div>
      </section>

      <section className="form-panel" aria-labelledby="auth-title">
        <div className="form-wrap">
          <div className="mode-switch" role="tablist" aria-label="Account actions">
            <button className={mode === "signin" ? "active" : ""} type="button" onClick={() => switchMode("signin")} role="tab" aria-selected={mode === "signin"}>Sign in</button>
            <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => switchMode("signup")} role="tab" aria-selected={mode === "signup"}>Create account</button>
          </div>
          <p className="eyebrow">{mode === "signin" ? "Welcome back" : "Join the neighborhood"}</p>
          <h2 id="auth-title">{mode === "signin" ? "Good to see you." : "Make yourself at home."}</h2>
          <p className="form-intro">{mode === "signin" ? "Sign in to pick up where you left off." : "Create an account and meet your future favorite cats."}</p>

          <form onSubmit={handleSubmit} noValidate>
            {mode === "signup" && <label>Name<input name="name" type="text" value={form.name} onChange={updateField} placeholder="Your name" autoComplete="name" /></label>}
            <label>Email address<input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" /></label>
            <label>Password<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={updateField} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button className="visibility-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div></label>
            {mode === "signin" && <button className="text-button" type="button" onClick={() => setMessage("Password reset is ready to connect to your email service.")}>Forgot password?</button>}
            {error && <p className="form-message error" role="alert">{error}</p>}
            {message && <p className="form-message success" role="status">{message}</p>}
            <button className="primary-button" type="submit">{mode === "signin" ? "Sign in" : "Create my account"}<span aria-hidden="true">↗</span></button>
          </form>
          <p className="fine-print">By continuing, you agree to our <a href="#terms">community guidelines</a>.</p>
        </div>
      </section>
    </main>
  );
}