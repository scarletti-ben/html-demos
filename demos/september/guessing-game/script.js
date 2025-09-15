// < ======================================================
// < Imports
// < ======================================================

import * as tools from "./modules/site-tools.js";
import * as experimental from "./modules/experimental.js";
import * as paw from "./modules/parliament-api-wrapper.js";

import {
    firebaseConfig,
    initializeApp,
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    updateProfile
} from "./modules/firebase-api-wrapper.js";

import {
    getDatabase,
    clearDatabase,
    get,
    set,
    ref,
    push,
    remove,
    onValue
} from "./modules/realtime-database-wrapper.js";

// < ======================================================
// < Declarations: General
// < ======================================================

const people = [];
const COLUMNS = 6;
const ROWS = 3;
const DATABASE_URL = "https://guessing-game-alpha-default-rtdb.europe-west1.firebasedatabase.app";

// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const sidebar = /** @type {HTMLDivElement} */
    (document.getElementById('sidebar'));

const middle = /** @type {HTMLDivElement} */
    (document.getElementById('middle'));

const messenger = /** @type {HTMLDivElement} */
    (document.getElementById('messenger'));

const textarea = /** @type {HTMLTextAreaElement} */
    (document.getElementById('textarea'));

const queries = {
    page: document.getElementById('page'),
    grid: document.getElementById('grid'),
}

// < ======================================================
// < Functions
// < ======================================================

function createMessage(text, flavour) {
    const div = document.createElement('div');
    // div.classList.add('message');
    div.classList.add(flavour);
    div.textContent = text;
    return div;
}

function sendMessage(text) {
    const message = createMessage(text, 'sent');
    messenger.querySelector('.middle').appendChild(message);
    scroller();
}

function receiveMessage(text) {
    const message = createMessage(text, 'received');
    messenger.querySelector('.middle').appendChild(message);
    scroller();
}

function addMessage(text, flavour) {
    const message = createMessage(text, flavour);
    messenger.querySelector('.middle').appendChild(message);
    scroller();
}

function scroller() {
    const element = messenger.querySelector('.middle');
    // element.scrollTop = element.scrollHeight;
    element.scrollTo(0, element.scrollHeight);
}

// function thing() {
//     const message = textarea.value.trim();
//     if (message.length === 0) return;
//     if (tools.randbool()) {
//         sendMessage(message);
//     } else {
//         receiveMessage(message);
//     }
//     textarea.value = '';
//     autoResize();
// }

function thing(user, database) {
    const message = textarea.value.trim();
    if (message.length === 0) return;
    sendMessage(message);
    messageToDatabase(message, user, database)
    textarea.value = '';
    autoResize();
}

function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/** 
 * Clone an HTML element inside the same parent element
 * 
 * @param {HTMLElement} element The element to clone
 * @example
 * const element = document.getElementById('element')
 * element.addEventListener('click', () => {
 *     cloneElement(element);
 * })
 * 
 * @example
 * document.addEventListener('click', (event) => {
 *     const element = event.target.closest('.element');
 *     if (!element) return;
 *     cloneElement(element);
 * })
 */
function cloneElement(element) {
    const clone = element.cloneNode(true);
    element.parentNode.appendChild(clone);
}

/** 
 * Set up the grid element with columns and rows
 * 
 * @param {number} rows - The number of rows in the grid
 * @param {number} columns - The number of columns in the grid
 */
function setupGrid(rows, columns) {
    queries.grid.style.cssText = `
        grid-template-rows: repeat(${rows}, 1fr);
        grid-template-columns: repeat(${columns}, 1fr);
    `
}

/** 
 * Create a grid cell element
 * 
 * @param {string} url - The url for the image
 * @param {number} row - The row of the grid
 * @param {number} col - The column of the grid
 * @param {Object} options - Configuration options
 * @param {string} options.name - The name for the cell ['test']
 * @param {string} options.colour  - The colour of the cell ['green']
 * @returns {HTMLDivElement} The grid cell element
 */
function createCell(url, row, col, { name = 'test', colour = 'green' } = {}) {
    const html = /* HTML */`

      <div class="cell" data-row="${row}" data-col="${col}" style='border-color: ${colour};'>
        <div class="card">
          <img src="${url}" class="picture">
          <div class="name">${name}</div>
        </div>
      </div>

    `
    return tools.parseToElement(html.trim());
}

/** 
 * 
 * @param {HTMLDivElement} cell 
 */
function addListeners(cell, member) {
    cell.addEventListener('click', () => {
        // member.viewPage();
        cell.classList.toggle('eliminated');
    })

}

/** 
 * Create a person for the game, with an associated grid cell element
 * 
 * @param {CleanMember} member - A clean representation of a `Member` object
 * @param {number} row - The row of the grid
 * @param {number} col - The column of the grid
 * @returns {HTMLDivElement} The grid cell element for the person
 */
function createPerson(member, row, col) {
    const cell = createCell(member.thumbnail, row, col, {
        name: member.surname,
        colour: member.colour
    });
    cell.title = member.toString();
    addListeners(cell, member);
    queries.grid.appendChild(cell);
    people.push(member);
    return cell;
}

async function login() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const credentials = await signInAnonymously(auth);
    return {
        app,
        auth,
        credentials
    }
}

const regions = [
    "London",
    "Yorkshire and The Humber",
    "South West",
    "West Midlands",
    "East Midlands",
    "East of England",
    "North West",
    "South East",
    "North East",
    "Scotland",
    "Wales",
    "Northern Ireland"
]

const descriptors = [
    "happy", "lazy", "sleepy", "brave", "silly",
    "cheerful", "grumpy", "curious", "shy", "jolly",
    "calm", "mischievous", "proud", "friendly", "clever",
    "gentle", "bold", "playful", "quiet", "kind"
];

const colours = [
    "red", "blue", "green", "yellow", "orange",
    "purple", "pink", "brown", "black", "white",
    "grey", "cyan", "magenta", "lime", "teal",
    "navy", "maroon", "olive", "violet", "turquoise"
];

const animals = [
    "panda", "tiger", "otter", "fox", "koala",
    "lion", "bear", "wolf", "rabbit", "deer",
    "elephant", "giraffe", "monkey", "squirrel", "badger",
    "rhino", "hippo", "lemur", "hedgehog", "camel"
];

function randomUsername() {
    return [
        tools.choice(descriptors),
        tools.choice(colours),
        tools.choice(animals)
    ].join('-');
}

const schema = {
    rooms: {
        room1: {
            players: {
                player1: { x: 0, y: 0, connected: true },
                player2: { x: 100, y: 100, connected: false }
            },
            state: "playing"
        },
        room2: {
            players: {
                player3: { x: 50, y: 50, connected: true }
            },
            state: "waiting"
        }
    },
    users: {
        user1: { name: "John", score: 100 },
        user2: { name: "Jane", score: 200 }
    }
};

function messageToDatabase(text, user, database) {
    const _messagesRef = ref(database, 'messages');
    const newMessageRef = push(_messagesRef);
    set(newMessageRef, {
        text,
        timestamp: Date.now(),
        user: {
            id: user.uid,
            name: user.displayName,
        }
    });
}

async function clearDatabase2(database) {
    try {
        const rootRef = ref(database, '/');
        await remove(rootRef);
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
}

function isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return true;
    if (/android/i.test(ua)) return true;
    if ('ontouchstart' in window && Math.min(window.innerWidth, window.innerHeight) <= 800) return true;
    return false;
}


// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

// ? Run callback when all resources have loaded
window.addEventListener('load', async () => {


    let debugging = false;
    {
        // NOTE: http://127.0.0.1:5502/001/index.html?debug=true
        const params = new URLSearchParams(window.location.search);
        debugging = params.get('debug') === 'true';

    }

    if (debugging) {
        // alert('Debug mode active');
        console.log('Debug mode active');
    }

    // Log in
    // const details = await login();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const credentials = await signInAnonymously(auth);
    const user = auth.currentUser;
    console.log(`User ID: ${user.uid}`);
    console.log(`User Name: ${user.displayName}`);
    console.log(`User Thumbnail: ${user.photoURL}`);
    console.log(`User Anonymous: ${user.isAnonymous}`);

    const database = getDatabase(app, DATABASE_URL);

    await clearDatabase2(database);
    // messageToDatabase('test', user, database);
    // await set(ref(database, '/'), {
    //     messages: {}
    // });
    const snapshot = await get(ref(database, '/'));
    const data = snapshot.val();
    console.log("database data: ", data);

    const seenMessages = new Set();

    // Set up WebSocket listener for new messages
    const _messagesRef = ref(database, 'messages');
    onValue(_messagesRef, (snapshot) => {
        const messages = snapshot.val();
        if (messages) {
            for (const [id, message] of Object.entries(messages)) {
                if (seenMessages.has(id)) continue;
                if (message.user.id !== user.uid) {
                    console.warn('adding message');
                    addMessage(message.text, 'received');
                }
                seenMessages.add(id);
            }
        } else {
            console.warn('No messages');
        }
        console.log(`Seen: ${seenMessages}`);
    });

    setupGrid(ROWS, COLUMNS);
    const members = await paw.init();
    console.log(`There are currently ${members.length} members in the array`);

    // Randomly shuffle members
    if (!debugging) {
        tools.shuffle(members);
    }

    // Choose a random member

    // Filter members
    // members.filter((member) => member.region = '');

    let i = 0;
    for (const row of tools.range(ROWS)) {
        for (const col of tools.range(COLUMNS)) {
            const member = members[i++];
            createPerson(member, row, col);
        }
    }
    tools.choice(document.querySelectorAll('.cell')).classList.add('chosen');


    {
        // Load spritesheet into the DOM
        const svg = await tools.fetchSVGElement('./assets/svg/lucide.svg');
        document.body.appendChild(svg);
    }

    {
        // Add SVG icon to the sidebar
        const svg = tools.createSVGElement('palette');
        svg.style.cssText = `
            width: 1.5rem;
            height: 1.5rem;
            user-select: none;
            cursor: pointer;
        `
        sidebar.querySelector('.middle').appendChild(svg);

        // Add theme switcher functionality
        const themes = tools.getThemes();
        const cycle = new tools.Cycle(themes);
        svg.addEventListener('click', () => {
            const value = cycle.next();
            document.body.dataset.theme = value;
        });
    }

    {
        // Add profile picture image to sidebar
        const img = document.createElement('img');
        img.src = './assets/jpg/profile.jpg';
        img.classList.add('cmyk');
        img.style.cssText = `
            width: 32px;
            height: 32px;
            margin: 0;
            padding: 2px;
            user-select: none;
            cursor: pointer;
            border-radius: 50%;
        `
        sidebar.querySelector('.footer').appendChild(img);

    }

    {
        // Add SVG icon to the sidebar
        const svg = tools.createSVGElement('send-horizontal');
        svg.style.cssText = `
            width: 1.5rem;
            height: 1.5rem;
            user-select: none;
            cursor: pointer;
            margin-left: 8px;
        `
        messenger.querySelector('.footer').appendChild(svg);
        svg.addEventListener('click', () => {
            thing(user, database);
        });
    }

    {
        textarea.addEventListener('input', autoResize);
        textarea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                console.log(2);
                thing(user, database);
            }
        });
    }

    {
        // Add SVG icon to the sidebar
        const svg = tools.createSVGElement('sidebar-close');
        svg.style.cssText = `
            width: 1.5rem;
            height: 1.5rem;
            user-select: none;
            cursor: pointer;
        `
        document.getElementById('floater').appendChild(svg);
        svg.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            const use = svg.querySelector('use')
            const current = use.getAttribute('href');
            if (current === '#sidebar-close') {
                use.setAttribute('href', '#sidebar-open');
            } else {
                use.setAttribute('href', '#sidebar-close');
            }
        });
    }

    // document.addEventListener('click', (event) => {
    //     const cell = event.target.closest('.cell');
    //     if (!cell) return;
    //     cloneElement(cell);
    // })


    {
        // const textarea = document.querySelector('#textarea');

        // function autoResize() {
        //     textarea.style.height = 'auto';
        //     textarea.style.height = textarea.scrollHeight + 'px';
        // }

        // textarea.addEventListener('input', autoResize);
        // textarea.addEventListener('focus', autoResize);
    }

    // Add keydown listeners
    document.addEventListener('keydown', (event) => {

        // Toggle debugging lines
        if (event.ctrlKey && event.altKey && event.key === 'd') {
            event.preventDefault();
            document.body.classList.toggle('debugging');
        }

    });

    // Show the page element
    if (!isMobile()) {
        page.style.display = '';
    } else {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center;">
                <h1>Not currently available on mobile devices</h1>
                <p>Please use a desktop browser to view the site</p>
            </div>
        `;
    }

});