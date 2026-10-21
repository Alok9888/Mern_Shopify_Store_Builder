import { useState } from "react"
import { API_BASE_URL } from "../config.js"

export default function ServiceFinder({ onAdd }) {
  const [need, setNeed] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [addedId, setAddedId] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState("")

  const findService = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    setAddedId("")
    setFeedback(null)
    setFeedbackError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Could not find a service")
      setResult(data)
    } catch (requestError) {
      setError(requestError.message || "Could not reach the service finder. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const rateRecommendation = async (helpful) => {
    if (!result?.requestId) return
    setFeedbackLoading(true)
    setFeedbackError("")
    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/feedback/${result.requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Could not save feedback")
      setFeedback(helpful)
    } catch (requestError) {
      setFeedbackError(requestError.message || "Could not save feedback. Please try again.")
    } finally {
      setFeedbackLoading(false)
    }
  }

  return (
    <section className="service-finder" aria-labelledby="service-finder-title">
      <div className="service-finder__masthead">
        <span className="service-finder__eyebrow">Service desk / AI assisted</span>
        <span className="service-finder__issue">01 — 03</span>
      </div>

      <div className="service-finder__main">
        <div className="service-finder__intro">
          <h2 id="service-finder-title">Find the right help for your store.</h2>
          <p>
            Tell us what you’re working on. We’ll look through the available services and suggest a good fit.
          </p>
          <div className="service-finder__examples">
            <span className="service-finder__examples-label">A few starting points</span>
            <p>Improve store speed <span>·</span> Move to Shopify <span>·</span> Get more search traffic</p>
          </div>
        </div>

        <form onSubmit={findService} className="service-finder__form">
          <div className="service-finder__form-heading">
            <span className="service-finder__step">01</span>
            <label htmlFor="service-need">Describe what you need</label>
          </div>
          <textarea
            id="service-need"
            value={need}
            onChange={(event) => setNeed(event.target.value)}
            placeholder="Describe a goal or issue…"
            minLength={5}
            maxLength={500}
            rows={4}
            required
            aria-describedby="service-need-hint"
          />
          <div className="service-finder__form-footer">
            <span id="service-need-hint" className="service-finder__hint">
              {need.length}/500 characters
            </span>
            <button type="submit" disabled={loading || need.trim().length < 5}>
              {loading ? "Reviewing services…" : "Find my service"}
            </button>
          </div>
          <p className="service-finder__privacy-note">Your request and rating are stored for admin review to improve recommendations.</p>
          {loading && <p className="service-finder__loading" role="status">Matching your request against the service catalog.</p>}
        </form>
      </div>

      {error && (
        <div className="service-finder__feedback service-finder__feedback--error" role="alert">
          <span className="service-finder__feedback-label">Service finder unavailable</span>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="service-finder__results" aria-live="polite">
          <div className="service-finder__results-heading">
            <div>
              <span className="service-finder__eyebrow">Your recommendations</span>
              <p>{result.message}</p>
            </div>
            <span className="service-finder__issue">
              {String(result.recommendations?.length || 0).padStart(2, "0")} MATCHES
            </span>
          </div>

          {result.recommendations?.length > 0 ? (
            <ul className="service-finder__recommendations">
              {result.recommendations.map((product, index) => (
                <li key={product._id} className="service-finder__recommendation">
                  <div className="service-finder__recommendation-topline">
                    <span className="service-finder__issue">0{index + 1} / SERVICE</span>
                    <span className="service-finder__category">{product.category}</span>
                  </div>
                  <div className="service-finder__recommendation-copy">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <div className="service-finder__recommendation-footer">
                    <span className="service-finder__price">₹{Number(product.price).toLocaleString("en-IN")}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onAdd(product)
                        setAddedId(String(product._id))
                      }}
                    >
                      {addedId === String(product._id) ? "Added to cart" : "Add to cart"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="service-finder__empty">Try describing a different goal, or browse the full service list below.</p>
          )}
          <div className="service-finder__rating" aria-live="polite">
            {feedback === null ? (
              <>
                <span>Did we get it right?</span>
                <button type="button" disabled={feedbackLoading} onClick={() => rateRecommendation(true)}>Helpful</button>
                <button type="button" disabled={feedbackLoading} onClick={() => rateRecommendation(false)}>Not relevant</button>
              </>
            ) : (
              <p>Thank you. Your feedback will help us improve these recommendations.</p>
            )}
          </div>
          {feedbackError && <p className="service-finder__rating-error" role="alert">{feedbackError}</p>}
        </div>
      )}
    </section>
  )
}
