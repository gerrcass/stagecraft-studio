# Deterministic QA runs before vision review

Vision-language judgments are noisy and can miss clipped text or reward a pretty but unreadable
frame. The studio checks bounds, overflow, collisions, minimum type size, known-token contrast,
caption timing and loudness deterministically, then uses contact sheets and an optional vision
review for composition. A human remains the final gate. This keeps the feedback loop cheap and
reproducible even when the model changes.
