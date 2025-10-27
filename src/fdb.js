/**
 * Functional Database
 * 
 * requires:
 * - f.js
 * */

const asyncdbfail = f => chainpp (f) (errorof) (target)

const asyncdbsuccess = f => chainpp (f) (result) (target)

const objectstore = s => t => t.objectStore (s)

const open_ = version => name => onupgrade => onerror => onsuccess => (
	Monad (indexedDB.open (name, version))
	.$(setmethod ("onerror") (onerror))
	.$(setmethod ("onsuccess") (onsuccess))
	.$(setmethod ("onupgradeneeded") (onupgrade))
	.$()
)

export const open = version => name => onupgrade => (
	new Promise ((ok, fail) => (
		open_
		(version)
		(name)
		(chainpp (onupgrade) (debug) (result) (target))
		(asyncdbfail (fail))
		(asyncdbsuccess (ok))
	))
)

export const add = db => store => value => (
	new Promise ((ok, fail) => (
		Monad (db.transaction ([store], "readwrite"))
		.$(objectstore (store))
		.$(s => s.add(value))
		.$(setmethod ("onerror") (asyncdbfail (fail)))
		.$(setmethod ("onsuccess") (asyncdbsuccess (ok)))
		.$()
	))
)

export const put = db => store => value => (
	new Promise ((ok, fail) => (
		Monad (db.transaction ([store], "readwrite"))
		.$(objectstore (store))
		.$(s => s.put(value))
		.$(setmethod ("onerror") (asyncdbfail (fail)))
		.$(setmethod ("onsuccess") (asyncdbsuccess (ok)))
		.$()
	))
)

export const get = db => store => key => (
	new Promise ((ok, fail) => (
		Monad (db.transaction ([store]))
		.$(objectstore (store))
		.$(s => s.get (key))
		.$(setmethod ("onerror") (asyncdbfail (fail)))
		.$(setmethod ("onsuccess") (asyncdbsuccess (ok)))
		.$()
	))
)

export const del = db => store => key => (
	new Promise ((ok, fail) => (
		Monad (db.transaction ([store], "readwrite"))
		.$(objectstore (store))
		.$(s => s.delete (key))
		.$(setmethod ("onerror") (asyncdbfail (fail)))
		.$(setmethod ("onsuccess") (asyncdbsuccess (ok)))
		.$()
	))
)

const resolvecursor = list => ok => ev => (
	Monad (ev)
	.$(target)
	.$(result)
	.$(
		x => x
		? side (x.continue()) (_ => push (value (x)) (list))
		: ok (list)
	)
	.$()
)

export const list = db => store => (
	new Promise ((ok, fail) => (
		Monad (db.transaction ([store]))
		.$(objectstore (store))
		.$(s => s.openCursor ())
		.$(setmethod ("onerror") (asyncdbfail (fail)))
		.$(setmethod ("onsuccess") (resolvecursor ([]) (ok)))
		.$()
	))
)

