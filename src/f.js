/**
 * Functional JavaScript
 * 
 * */

///////////////////////////////////////////////////////////////////////////////
/// General
///////////////////////////////////////////////////////////////////////////////

/// Makes arrow functions syntax a little better.
let _ = null

/// Defines a deprecated function.
/// deprecated :: String -> (a -> b) -> (a -> b)
const deprecated = s => f => a => {
	console.warn (s)
	return f (a)
}

/// A empty function.
/// pass :: () -> ()
const pass = _ => _

/// Returns the received value.
/// raw :: a -> a
const raw = a => a

/// Any constructor.
/// Any :: a -> a
const Any = raw

/// Calls the received function.
/// call :: (a -> a) -> a
const call = f => f ()

/// Explicitly defines a side-effect and returns the argument.
/// side :: a -> () -> a
const side = a => f => { f (a); return a; }

/// Calls the received function and return it.
/// once :: (a -> a) -> a
const once = f => side (f) (f)

/// Swap a function's argument order.
/// NOTE: in haskell this is called flip.
/// swap :: (a -> b -> c) -> a -> b -> c
const swap = f => a => b => f (b) (a)

/// Executes a function if condition is truthy.
/// ifx :: (a -> a) -> Bool -> a
const ifx = deprecated ("ifx deprecated, use $if") (
	c => f => c && f ()
)

/// Calls a function if condition is truthy.
/// $ :: Bool -> (a -> b) -> b | undefined
const $if = b => f => b ? f () : undefined

/// Similar to _$if_ but pass argument to function.
/// ifa :: (a -> Bool) -> (a -> b) -> a -> b | a
const ifa = c => f => a => c (a) ? f (a) : a

/// A ternary operator but with functions.
/// tern :: (a -> b) -> (a -> b) -> Bool -> b
const tern = deprecated ("tern deprecated, just use default ternary") (
	f => g => c => c ? f () : g ()
)

/// Same as _tern_ but uses a function to obtain the condition.
/// ternf :: (a -> b) -> (a -> b) -> (c -> Bool) -> b
const ternf = deprecated ("ternf deprecated, just use default ternary") (
	f => g => h => c => h (c) ? f () : g ()
)

/// Chain two functions together.
/// chain :: (b -> c) -> (a -> b) -> a -> c
const chain = f => g => a => f (g (a))

/// Chain multiple functions together.
/// NOTE: function execution is backwards.
/// chainpp :: (a -> a) -> (a -> a) | a -> ...
const chainpp = f => a => (
	typeof a === "function"
	? chainpp (chain (f) (a))
	: f (a)
)

/// Alias to _chainpp_.
const $ = chainpp

/// Similar to _chainpp_ but uses a list as input.
/// NOTE: function execution in order.
/// compose :: [(a -> b)] -> a -> b
const compose = xs => {
	const $f = fst (xs)
	const $fs = rest (xs)
	return (
		$f === undefined
		? (
			len ($fs) > 0
			? compose ($fs)
			: pass
		)
		: len ($fs) <= 0
		? $f
		: chain (compose ($fs)) ($f)
	)
}

/// Wraps {f} inside a non-arg function.
/// wrap :: () -> None -> ()
const wrap = deprecated ("wrap deprecated, perfer arrow functions") (
	f => _ => f ()
)

/// Returns a new function that calls {f} with {a} as argument.
/// bind :: a -> (a -> b) -> () -> b
const bind = deprecated ("bind deprecated, prefer arrow functions") (
	a => f => _ => f (a)
)

/// Maps {a} if {c} is truthy otherwise return {a}.
/// mapif :: (a -> b) -> Bool -> a -> a | b
const mapif = deprecated ("mapif deprecated, perfer ifa") (
	f => c => a => c ? f (a) : a
)

/// Maps {a} if {c} is truthy returning {c}.
/// mapif1 :: (a -> b) -> Bool -> a -> a | b
const mapif1 = deprecated ("mapif1 deprecated, what this means?") (
	f => c => a => side (c) (_ => c ? f (a) : a)
)

/// Creates a pair.
/// pair :: a -> b -> [a, b]
const pair = a => b => [a, b]

/// Creates a pair of value and it's mapped value.
/// pairf :: (a -> b) -> a -> [a, b]
const pairf = f => a => pair (a) (f (a))

/// Maps a pair.
/// mappair :: (a -> b) -> (c -> d) -> [a, c] -> [b, d]
const mappair = f => g => ([a, c]) => [f (a), g (c)]

/// Uses pair as arguments for function.
/// pairargs :: (a -> b -> c) -> [a, b] -> c
const pairargs = f => ([a, b]) => f (a) (b)

/// Pattern matching.
/// match :: a -> .1 (a -> Bool) -> (b -> c) -> .1
const match = a => f => g => (
	side (match (a)) (_ => $if (f (a)) (g))
)

/// Define getters/setters for a record.
/// getsetmethods :: ({..} -> {..}) -> ({..} -> {..})
const getsetmethods = a => getsetmethods0 (a) ($ (proplist) (a) ({}))

/// Base implementation for _getsetmethods_.
/// getsetmethods0 :: ({..} -> {..}) -> ({..} -> {..})
const getsetmethods0 = a => ([f, ...fs]) => (
	f === undefined
	? a
	: side (getsetmethods0 (a) (fs))
	(_ => {
		a[f] = (x => x[f])
		a["set" + f] = (v => x => x[f] = v)
	})
)

/// Syntax for defining record fields.
/// field :: (String, (a -> b), b) -> (String, (a -> b), b)
const field = (name, type, ...initial) => [name, type, ...initial]

/// Objects with properties, setters and getters.
/// record :: [(String, (a -> b))] -> ({..} -> {..})
const record = fields => getsetmethods ((a = {}) => (
	fold (b => ([name, type, init]) => side (b) (_ => {
		b[name] = a[name] ? type (a[name]) : type (init)
	})) ({}) (List (fields))
))

/// Used to applies various function that maps {x}.
/// NOTE: now we have _monad_ which is a simpler _Monad_,
///       but this is heavily used, so let's keep it, for now.
/// NOTE: errors when {f} is not a function nor undefined.
const Monad = x => ({
	$: f => (
		f === undefined
		? x
		: (
			typeof x?.then === "function"
			? Monad (x.then (f))
			: (
				typeof f === "function"
				? Monad (f (x))
				: Monad (x)
			)
		)
	),
	$if: c => f => c ? Monad (x).$(f) : Monad (x),
})

/// What is a monad? Is this monad?
/// monad :: a -> .1 (a -> a) -> .1 | a
const monad = a => f => (
	typeof f === "function"
	? monad (f (a))
	: a
)

/// String format.
/// format :: String -> [a] -> String
const format = s => ([x, ...xs]) => (
	x === undefined
	? s
	: format (s.replace ("{}", x)) (xs)
)

/// Identifier counter.
/// idcounter :: Int
let idcounter = 0

/// Creates a identifier.
/// Id :: String -> () -> Int
const Id = _ => idcounter ++

///////////////////////////////////////////////////////////////////////////////
/// Logging
///////////////////////////////////////////////////////////////////////////////

/// Logger.
/// logger :: f -> String -> a -> a
const logger = f => p => a => side (a) (_ => f (p, a))

/// Logger for debug.
/// loggerd :: String -> a -> a
const loggerd = logger (console.debug)

/// Logger for error.
/// loggere :: String -> a -> a
const loggere = logger (console.error)

/// Debug logging.
/// debug :: a -> a
const debug = loggerd ("debug:")

/// Error logging.
/// error :: a -> a
const error = loggere ("error:")

///////////////////////////////////////////////////////////////////////////////
/// Lists
///////////////////////////////////////////////////////////////////////////////

/// List type function.
/// List :: a -> [a]
const List = x => (
	x instanceof Array
	? filter (ne (undefined)) (x)
	: x === undefined || x === null
	? []
	: [x]
)

/// TypedList type function.
const TypedList = type => x => maplist (type) (List (x))

/// Create a range list.
/// NOTE: range may be a iterator not a list.
/// Int -> Int -> [Int]
const range = a => b => (
	a > b
	? []
	: [a, ...range (a + 1) (b)]
)

/// Create a list with a single value.
/// a -> [a]
const single = a => [a]

/// Returns the length of list.
const len = xs => xs.length

/// Returns the first item in the list.
/// fst :: [a] -> a
const fst = xs => xs[0]

/// Returns the seconds item in the list.
/// snd :: [a] -> a
const snd = xs => xs[1]

/// Returns the last item in the list.
/// last :: [a] -> a | undefined
const last = xs => xs[len (xs) - 1]

/// Returns the nth item in the list.
/// nth :: Int -> [a] -> a
const nth = n => xs => xs[n]

/// Returns all elements except the last one.
/// init :: [a] -> [a]
const init = xs => xs.slice (0, len (xs) - 1)

/// Returns the list without the first argument.
/// NOTE: in haskell this is called tail.
/// rest :: [a] -> [a]
const rest = ([x, ...xs]) => xs

/// Skip n elements from the list.
/// skip :: Int -> [a] -> [a]
const skip = n => xs => xs.slice (n)

/// Take n elements from the list.
/// take :: Int -> [a] -> [a]
const take = n => xs => xs.slice (0, n)

/// Returns a new list with {x} appended to it.
/// append :: a -> [a] -> [a]
const append = x => xs => [...xs, x]

/// Returns the same list with {x} appended to it.
/// push :: a -> [a] -> [a]
const push = x => xs => side (xs) (_ => xs.push (x))

/// Shifts one item from the list.
/// shift :: a -> [a] -> [a]
const shift = xs => side (xs) (_ => xs.shift (1))

/// Duplicates {a} into a list.
/// dup :: a -> [a, a]
const dup = x => [x, x]

/// Get the index of a value in a list.
const indexof = x => xs => xs.indexOf (x)

/// Check if value is in list.
const includes = x => xs => xs.includes (x)

/// Sum all values in list.
const sumlist = xs => fold (add) (0) (xs)

/// Returns the reversed array.
const reverse = xs => xs.toReversed ()

/// Fold a list.
/// NOTE: should {f} accept a pair or two arguments?
/// fold :: (a -> b -> a) -> a -> [b]
const fold = f => a => ([x, ...xs]) => (
	x === undefined
	? (
		len (xs) > 0
		? fold (f) (a) (xs)
		: a
	)
	: fold (f) (f (a) (x)) (xs)
)

/// Find in list.
/// find :: (a -> Bool) -> [a] -> a
const find = f => xs => {
	const $x = fst (xs)
	const $xs = rest (xs)
	return (
		$x === undefined || f ($x)
		? $x
		: find (f) ($xs)
	)
}

/// Filter a list.
/// filter :: (a -> Bool) -> [a]
const filter = f => ([x, ...xs]) => (
	x === undefined
	? (
		len (xs) > 0
		? filter (f) (xs)
		: []
	)
	: (
		f (x)
		? [x, ...filter (f) (xs)]
		: [...filter (f) (xs)]
	)
)

/// Maps a list.
/// maplist :: (a -> b) -> [a] -> [b]
const maplist = f => ([x, ...xs]) => (
	x === undefined
	? (
		len (xs) > 0
		? maplist (f) (xs)
		: []
	)
	: [f (x), ...maplist (f) (xs)]
)

/// Maps a list with its index.
/// maplisti :: (a -> Int -> b) -> [a] -> [b]
const maplisti = f => xs => {
	const $r = range (0) (len (xs) - 1)
	return maplist (i => f (xs[i]) (i)) ($r)
}

/// Splits a list by predicate.
/// splitbypred :: (a -> Bool) -> [a] -> [[a], [a]]
const splitbypred = f => ([x, ...xs]) => (
	x === undefined
	? [[], []]
	: (
		f (x)
		? [[x, ...splitbypred (f) (xs) [0]], [...splitbypred (f) (xs) [1]]]
		: [[...splitbypred (f) (xs) [0]], [x, ...splitbypred (f) (xs) [1]]]
	)
)

///////////////////////////////////////////////////////////////////////////////
/// Comparators
///////////////////////////////////////////////////////////////////////////////

/// eq :: a -> a -> Bool
const eq = a => b => b === a

/// ne :: a -> a -> Bool
const ne = a => b => b !== a

/// le :: a -> a -> Bool
const le = a => b => b <= a

///////////////////////////////////////////////////////////////////////////////
/// Math
///////////////////////////////////////////////////////////////////////////////

/// Int :: Int
const Int = a => (
	!Number.isNaN (Number (a))
	? round (Number (a))
	: 0
)

/// Num :: Num
const Num = a => (
	!Number.isNaN (Number (a))
	? Number (a)
	: 0.0
)

/// PI :: Int
const PI = Math.PI

/// add :: Num -> Num -> Num
/// NOTE: maybe this could be called _sum_.
const add = a => b => a + b

/// sub :: Num -> Num -> Num
const sub = a => b => a - b

/// mul :: Num -> Num -> Num
const mul = a => b => a * b

/// div :: Num -> Num -> Num
const div = a => b => a / b

/// min :: Int -> Int -> Int
const min = a => b => Math.min (a, b)

/// max :: Int -> Int -> Int
const max = a => b => Math.max (a, b)

/// cos :: Num -> Float
const cos = a => Math.cos (a)

/// sin :: Num -> Float
const sin = a => Math.sin (a)

/// sqrt :: Num -> Float
const sqrt = a => Math.sqrt (a)

/// atan2 :: Num -> Float
const atan2 = y => x => Math.atan2 (y, x)

/// clamp :: Int -> Int -> Int -> Int
const clamp = a => b => c => $ (min (a)) (max (b)) (c)

/// round :: Float -> Int
const round = n => Math.round (n)

/// floor :: Float -> Int
const floor = n => Math.floor (n)

/// random :: Int -> Float
const random = n => Math.random () * (n + 1)

///////////////////////////////////////////////////////////////////////////////
/// Js Helpers 
///////////////////////////////////////////////////////////////////////////////

/// value :: a -> b
const value = x => x.value

/// errorof :: a -> b
const errorof = x => x.error

/// result :: a -> b
const result = x => x.result

/// target :: a -> b
const target = x => x.target

/// copyobject :: {..} -> {..}
const copyobject = o => Object.assign ({}, o) 

/// setmethod :: String -> () -> Object a -> Object a
const setmethod = m => f => o => side (o) (_ => o[m] = f)

/// callmethod :: String -> Object a -> b
const callmethod = m => o => o[m]()

/// totext :: Object a -> b
const totext = callmethod ("text")

/// tojson :: Object a -> b
const tojson = callmethod ("json")

/// tostring :: Object a -> String
const tostring = callmethod ("toString")

/// toblob :: Object a -> Blob
const toblob = callmethod ("blob")

/// timeout :: () -> Int -> Int
const timeout = f => s => setTimeout (f, s) 

/// interval :: () -> Int -> Int
const interval = f => s => setInterval (f, s) 

/// clearinterval :: Int -> ()
const clearinterval = i => clearInterval (i) 

/// proplist :: {..} -> [String]
const proplist = a => Object.getOwnPropertyNames (a)

