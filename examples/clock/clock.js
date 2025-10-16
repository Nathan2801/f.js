
const c = palette ()

const appstyle = compose ([
	, color (c.fg ())
	, width (vw (100))
	, height (vh (100))
	, background (c.bg ())
	, alignitems ("center")
	, justifycontent ("center")
	, fontsize (vw (7.5))
])

const app = _ => {
	const clock = h1 (clockstring ())
	interval (_ => updateclock (clock)) (1000)
	return $ (appstyle) (child (clock)) (box ())
}

const clockstring = _ => (new Date()).toLocaleTimeString() ?? "??:??:??"

const updateclock = clock => setinner (clockstring ()) (clock)

compose ([
	, margin (px (0))
	, padding (px (0))
	, fontfamily ("sans-serif")
]) (document.body)

child (app ()) (document.body)
