
import * as fdb from "../../src/fdb.js"


const main = async _ => {
	const VERSION = 1
	const OBJECT_STORE = "stuff"
	const db = await fdb.open (VERSION) ("TestDatabase") (db => {
		// NOTE: Usual javascript stuff.
		db.createObjectStore (OBJECT_STORE, {
			keyPath: "id",
			autoIncrement: true,
		})
	})
	loggerd ("Database:\n") (db)

	const key = await fdb.add (db) (OBJECT_STORE) ({
		value: 69,
	})
	loggerd ("Key of added object:") (key)

	const value = await fdb.get (db) (OBJECT_STORE) (key)
	loggerd ("Value retrieved using key:") (value)

	const values = await fdb.list (db) (OBJECT_STORE)
	loggerd ("All values from object store:") (values)

	const removed = await fdb.del (db) (OBJECT_STORE) (key)
	loggerd ("Status from deletion (should be undefined!?):") (removed)
}


main ()

child (text ("Open DevTools Console!")) (document.body)

