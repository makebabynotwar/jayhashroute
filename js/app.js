// importing the JayHashRoute Library
import {JayHashRoute} from './JayHashRoute.js';

/*
 * Importing pages from includes folder
 * If you added a page in includes folder, manually import the page below with the same format
 * Don't forget to add your new page to the pages object below
 */
import {home} from '../includes/home.js';
import {about} from '../includes/about.js';
import {parent} from '../includes/parent.js';
import {childOne, child_two} from '../includes/children.js';

// The div element with a class of 'content' from index.html
const div = document.querySelector('.content');

// Pages Object: Pages imported from includes folder
const pages = {
	home, about, parent, childOne, child_two
}

/* 
 * 3 Parameters needed to instantiate a JayHashRoute object
 * 1st parameter - a div element to load the contents
 * 2nd parameter - an object of pages just like shown above
 * 3rd parameter - set a default page to load, the starter default is 'home' 
 */

// Instantiating a JayHashRoute object
const route = new JayHashRoute(div, pages, 'home');

/*Adding a string as prefix to the site's title. You can also add a string as the suffix.
 *NOTE: The site's default title will dynamically change once another page has loaded.
 */
route.addTitlePrefix(`Your Site's Name | `);

// Creating a parent to children relationship for routing
const relationship = {
	'parent' : [ 'childOne', 'child_two']
}

// Adding a relationship between a single parent to children in routes
route.addRelationship(relationship);
