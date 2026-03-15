
const showbox = $label => $child => compose ([
	, vbox
	, children ([
		, b ($label)
		, compose ([
			, box
			, child ($child)
			, background ("#ccccff")
			, margin ("12px 0px")
			, padding ("12px")
			, border ("1px solid #282828")
			, setstyle (["border-radius", "12px"])
		]) (_)
	])
]) (_)

const $basichtml = List ([
	, showbox ("h1:") (h1 ("Basic HTML elements"))
	, showbox ("h2:") (h2 ("Listed from fui.js file"))
	, showbox ("h3:") (h3 ("More coming soon..."))
	, showbox ("p:") (p ("A paragraph is more than necessary"))
	, showbox ("text/span:") (text ("this is a simple text/span?"))
	, showbox ("label:") (label ("what a fish does?"))
	, showbox ("br:") (br ())
	, showbox ("ul and li(s):") (children ([
		, li ("Item 1")
		, li ("Item 2")
		, li ("Item 3")
	]) (ul ()))
	, showbox ("button:") (button ("Press me!"))
	, showbox ("input(s):") (children ([
		, input ("text-input-name") ("text")
		, input ("number-input-name") ("number")
		, input ("password-input-name") ("password")
		, input ("submit-input-name") ("submit")
		, slider ("slider-input-name") ({
			min: 0, max: 100, step: 1
		})
	]) (vbox ()))
	, showbox ("select:") (select (["Dog", "Cat", "Fish"]) ("select-name"))
	, showbox ("textarea:") (textarea ("textarea-name"))
])

const $containers = List ([
	, showbox ("container (div):")
	($ (child (text ("foo"))) (container) ())
	, showbox ("box (div with flex):")
	($ (children ([p ("bar"), p ("baz")])) (box) ())
	, showbox ("vbox (div with vertical flex):")
	($ (children ([p ("bar"), p ("baz")])) (vbox) ())
])

children ($basichtml) (document.body)
children ($containers) (document.body)

