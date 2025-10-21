/**
 * Functional UI
 *
 * requires:
 * - f.js
 * */

/// :: Int -> String
const px = a => a + "px"

/// :: Int -> String
const vh = a => a + "vh"

/// :: Int -> String
const vw = a => a + "vw"

/// :: Int -> String
const pt = a => a + "pt"

/// :: Int -> String
const perc = a => a + "%"

/// :: a -> Element e -> Element e
const setvalue = a => e => side (e) (_ => e.value = a)

/// :: String -> (Event -> a) -> Element -> Element
const addevent = e => f => a => side (a) (_ => a.addEventListener (e, f))

/// :: String -> Element -> Element
const dispatch = e => a => side (a) (_ => a.dispatchEvent (new CustomEvent (e)))

/// :: (Event -> a) -> Element -> Element 
const onclick = setmethod ("onclick")

/// :: (Event -> a) -> Element -> Element
const oninput = setmethod ("oninput")

/// :: (Event -> a) -> Element -> Element
const onsubmit = setmethod ("onsubmit")

/// :: (Event -> a) -> Element -> Element
const onchange = setmethod ("onchange")

/// :: (Event -> a) -> Element -> Element
const prevent = ev => side (ev) (_ => ev.preventDefault())

/// :: Element a -> Element a
const play = a => side (a) (_ => a.play())

/// :: Element a -> Element a
const pause = a => side (a) (_ => a.pause())

/// :: Element a -> Bool
const paused = a => a.paused

/// :: Element a -> Element a
const click = a => side (a) (_ => a.click())

/// :: Int -> Element a -> Element a
const volume = v => a => side (a) (_ => a.volume = Number(v))

/// :: String -> Element | undefined
const id = id => document.getElementById(id)

/// :: String -> Element -> Element
const setid = _id => setattr (["id", _id])

/// :: String -> Element | undefined
const query = query => document.querySelector (query)

/// :: Element -> String -> Element | undefined
const queryfrom = e => query => e.querySelector (query)

/// :: String -> [Element | undefined]
const queryall = query => document.querySelectorAll (query)

/// :: String -> Element a -> String
const attr = k => a => a.getAttribute(k)

/// :: [String, String] -> Element a -> Element a
const setattr = ([k, v]) => a => side (a) (_ => a.setAttribute(k, v))

/// :: String -> Element a -> String
const style = k => a => a.style[k]

/// :: [String, String] -> Element a -> Element a
const setstyle = ([k, v]) => a => side (a) (_ => a.style[k] = v)

/// :: String -> Element a -> Element a
const color = v => setstyle (["color", v])

/// :: String -> Element a -> Element a
const display = v => setstyle (["display", v])

/// :: String -> Element a -> Element a
const position = v => setstyle (["position", v])

/// :: String -> Element a -> Element a
const top_ = v => setstyle (["top", v])

/// :: String -> Element a -> Element a
const left = v => setstyle (["left", v])

/// :: String -> Element a -> Element a
const flex = v => setstyle (["flex", v])

/// :: String -> Element a -> Element a
const width = v => setstyle (["width", v])

/// :: String -> Element a -> Element a
const minwidth = v => setstyle (["min-width", v])

/// :: String -> Element a -> Element a
const height = v => setstyle (["height", v])

/// :: String -> Element a -> Element a
const minheight = v => setstyle (["min-height", v])

/// :: String -> Element a -> Element a
const margin = v => setstyle (["margin", v])

/// :: String -> Element a -> Element a
const border = v => setstyle (["border", v])

/// :: String -> Element a -> Element a
const padding = v => setstyle (["padding", v])

/// :: String -> Element a -> Element a
const alignitems = v => setstyle (["align-items", v])

/// :: String -> Element a -> Element a
const justifycontent = v => setstyle (["justify-content", v])

/// :: String -> Element a -> Element a
const background = v => setstyle (["background", v])

/// :: String -> Element a -> Element a
const fontsize = v => setstyle (["font-size", v])

/// :: String -> Element a -> Element a
const fontfamily = v => setstyle (["font-family", v])

/// :: String -> Element a -> Element a
const flexwrap = v => setstyle (["flex-wrap", v])

/// :: Element a -> String
const inner = a => a.innerHTML

/// :: String -> Element a -> Element a
const setinner = v => a => side (a) (_ => a.innerHTML = v)

/// :: Element a -> Element a
const hide = display ("none")

/// :: Element a -> Element a
const show = display ("block")

/// :: Element a -> Element a
const showflex = display ("flex")

/// :: Side () -> Element a -> Element a
const togglevisibility = f => a => (
	style ("display") (a) === "none"
	? f (a)
	: hide (a)
)

/// :: String | Element -> Element
const elem = x => (
	typeof x === "string"
	? document.createElement(x)
	: x
)

/// :: Int
var _iid = 0

/// :: _ -> Int
const iid = _ => side (_iid) (_ => _iid += 1)

/// :: Element a -> Element b
const parent = a => a.parentNode

/// :: Element a -> Element b -> Element b
const child = a => p => side (p) (_ => p.appendChild (a))

/// :: [Element a] -> Element b -> Element b
const children = (xs = []) => p => (
	side (p) (_ => maplist (swap (child) (p)) (xs))
)

/// :: Element a -> [Element]
const getchildren = p => [...p.children]

/// :: Int -> Element a -> Element b
const getchild = i => a => a.children[i]

/// :: Int -> Element -> Element
const removechild = c => a => side (a) (_ => a.removeChild (c))

/// :: Element a -> Element a
const removelast = a => side (a) (_ => a.removeChild (a.lastChild))

/// :: Element a -> Element a
const erase = a => (
	a.lastChild !== null
	? chain (erase) (removelast) (a) 
	: a
)

/// :: _ -> Element br
const br = _ => elem ("br")

/// :: _ -> Element ul
const ul = _ => elem ("ul")

/// :: String -> Element li
const li = inner => chain (setinner (inner)) (elem) ("li")

/// :: String -> Element h1
const h1 = inner => chain (setinner (inner)) (elem) ("h1")

/// :: String -> Element h2
const h2 = inner => chain (setinner (inner)) (elem) ("h2")

/// :: String -> Element h3
const h3 = inner => chain (setinner (inner)) (elem) ("h3")

/// :: String -> Element span
const text = inner => chain (setinner (inner)) (elem) ("span")

/// :: String -> Element label
const label = inner => chain (setinner (inner)) (elem) ("label")

/// :: _ -> Element div
const container = _ => elem ("div")

/// :: _ -> Element div
const box = _ => chain (setstyle (["display", "flex"])) (elem) ("div")

/// :: _ -> Element div
const vbox = _ => chain (setstyle (["flexDirection", "column"])) (box) ()

/// :: String -> [String] -> Element select
const select = options => name => (
	Monad ("select")
	.$ (elem)
	.$ (setattr (["name", name]))
	.$ (children (
		maplist (a => (
			Monad ("option")
			.$ (elem)
			.$ (setvalue (a))
			.$ (setinner (a))
			.$ ()
		)) (TypedList (String) (options))
	))
	.$ ()
)

/// :: String -> Element input
const input = name => type => (
	Monad ("input")
	.$ (elem)
	.$ (setattr (["type", type]))
	.$ (setattr (["name", name]))
	.$ (oninput (_ => debug ("oninput not provided")))
	.$ ()
)

/// :: String -> Element input -> Element input
const placeholder = s => e => setattr (["placeholder", s]) (e)

/// :: (String -> a) -> Element input -> Element input
const bindinput = f => oninput ($ (f) (value) (target))

/// :: String -> Element input
const inputtext = name => input (name) ("text")

/// :: String -> String -> (Event -> _) -> Element input
const inputnumber = name => (
	Monad (input (name) ("number"))
	.$ ()
) 

/// :: String -> (Event -> _) -> Element input
const inputsubmit = value => (
	Monad (input ("") ("submit"))
	.$ (setattr (["value", value]))
	.$ ()
)

/// :: String -> (Event -> _) -> Element textarea
const textarea = name => (
	Monad ("textarea")
	.$ (elem)
	.$ (setattr (["name", name]))
	.$ (oninput (_ => debug ("oninput not provided")))
	.$ ()
)

/// :: String -> (Event -> _) -> Element input
const button = value => (
	Monad ("input")
	.$ (elem)
	.$ (setattr (["value",    value]))
	.$ (setattr ([ "type", "button"]))
	.$ (onclick (_ => debug ("onclick not provided")))
	.$ ()
)

/// SliderOpts
const SliderOpts = record ([
	, field ("min", Int, 0)
	, field ("max", Int, 100)
	, field ("step", Int, 1)
])

/// :: Int -> Int -> Int -> (Event -> _) -> Element input
const slider = name => opts => (
	Monad (input (name) ("range"))
	.$ (setattr (["min", SliderOpts.min (opts)]))
	.$ (setattr (["max", SliderOpts.max (opts)]))
	.$ (setattr (["step", SliderOpts.step (opts)]))
	.$ ()
)

/// :: CSSValue -> String -> Element svg
const svg = fill => path => (
	Monad ("i")
	.$ (elem)
	.$ (setstyle (["fill", fill]))
	.$ (swap (side) (e =>
		fetch(path)
		.then(totext)
		.then(swap (setinner) (e))
		.then(chainpp
			(setattr (["pointer-events", "none"]))
			(getchild (0))
		) // Specific for using with tabpage, but it kind make sense!?
	)) 
	.$ ()
)

/// :: (Event -> _) -> Element svg -> Element svg
const svgbutton = _onclick => svg => (
	Monad (svg)
	.$ (onclick (_onclick))
	.$ (setstyle (["cursor", "pointer"]))
	.$ ()
)

/// :: String -> Element svg
const svgwhite = svg ("white")

/// :: String -> Element svg
const svgblack = svg ("black")

/// :: _ -> Element form
const form = _ => elem ("form")

/// :: Element label -> Element input -> Element formentry
const formentry = label => input => (
	Monad (vbox ())
	.$ (child (label))
	.$ (child (input))
	.$ ()
)

/// :: String -> Element formentry -> Element formentry
const liveentry = prefix => entry => side (entry) (_ => {
	const label = getchild (0) (entry)
	const input = getchild (1) (entry)
	const update = _ => setinner (add (prefix) (value (input))) (label)
	addevent ("input") (update) (input)
	update ()
})

/// :: {..} -> Tab
const Tab = record ([
	  field ( "button", raw)
	, field ("content", raw)
])

/// :: {..} -> Tab
Tab.new = a => {
	const $id = iid ()
	return Tab ({
		button: setattr (["page-ref", $id]) (a?.button ?? button ("Tab") ()),
		content: setattr (["page-id", $id]) (a?.content ?? h1 ("Tab content"))
	})
}

/// :: [SingleTabPage] -> Element tabpage
const tabpage = pages => tabpage_ (true) (pages) (iid ())

/// :: [SingleTabPage] -> Element tabpage
const tabpageh = pages => tabpage_ (false) (pages) (iid ())

/// :: [SingleTabPage] -> Int -> Element tabpage
const tabpage_ = vertical => pages => id_ => (
	Monad (vertical ? vbox () : box())
	.$ (child (
		Monad (vbox ())
		.$(setid (id_ + "-content"))
		.$(mapif (setstyle (["order", 1])) (!vertical))
		.$(children (
			maplist (Tab.content) (pages)
		))
		.$(swap (side) (
			chainpp (maplist (hide)) (rest) (getchildren)
		))
		.$()
	)) 
	.$ (child (
		Monad (vertical ? box () : vbox())
		.$(children (
			maplist (Tab.button) (pages)
		))
		.$(swap (side) (
			chainpp
			(maplist (
				onclick (ev =>
					Monad (id (id_ + "-content"))
					.$(getchildren)
					.$(splitbypred (e =>
						attr ("page-id") (e) === attr ("page-ref") (target (ev))
					))
					.$(swap (side) (chain (maplist (show)) (fst)))
					.$(swap (side) (chain (maplist (hide)) (snd)))
				)
			))
			(getchildren)
		))
		.$()
	)) 
	.$ ()
)

/// :: Element tabpage -> Int -> Side ()
const tabcontroller = e => i => (
	chainpp (click) (nth (i)) (getchildren) (getchild (1)) (e)
)

/// :: String
const defaccent = "#fb568a";

/// :: ?
const palette = (accent = defaccent) => ({
	bg: i => [
		"#000000",
		"#282828",
		"#484848",
	][i ?? 0],
	fg: i => [
		"#ffffff",
		"#cccccc",
		"#aaaaaa",
	][i ?? 0],
	ac: _ => accent,
})

