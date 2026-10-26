# ffmpeg is the master; Resolve is optional

The creator’s workflow finishes in Resolve, but Resolve free does not support external API
automation and a GUI edit is not reproducible. The studio makes ffmpeg the automated master:
concat, mux, loudness, captions and chapters all run from a manifest. The handoff still includes
plates, stems, SRT, FCPXML/EDL and markers so a human can open the project in Resolve Studio for a
final polish pass. This preserves the creator’s finishing room without making it a build dependency.
