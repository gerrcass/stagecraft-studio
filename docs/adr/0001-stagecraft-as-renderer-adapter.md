# Stagecraft is the primary renderer, behind an adapter

Stagecraft already reproduces the reference look and is deterministic, typed and MIT; replacing it
would be a rewrite for no proven quality gain. The studio therefore owns scene IR and a
`RendererAdapter` boundary, with Stagecraft as the primary adapter and HyperFrames/Remotion as
documented alternatives. The public repo does not vendor the private engine; it ships a pre-rendered
demo and an optional Stagecraft peer dependency.
