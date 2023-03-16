const messagesArr = document.querySelectorAll(".message")
const inboxTabsArr = document.querySelectorAll(".btn-inbox:not(.selected-constant)")
const composeBody = document.querySelector("#compose-body")
const contentOffcanvas = document.querySelector("#content-offcanvas")
const sidebar = document.querySelector("#sidebar")
const content = document.querySelector("#content")
const hamburger = document.querySelector("#sidebar #hamburger")
const replyBtn = document.querySelector(".content-send i")
const replyContent = document.querySelector(".content-send .content-reply")
const searchContent = document.querySelector(".search-bar .search-bar-content")
const noMatches = document.querySelector("#no-search-match")


class Email {
    #sender
    #subject
    #content
    constructor(target,subject,from,body,email="") {
        this.target = target
        this.subject = subject
        this.from = from
        this.body = body
        this.email = email

        this.#sender = this.target.querySelector(".message-sender")
        this.#subject = this.target.querySelector(".message-subject")
        this.#content = this.target.querySelector(".message-preview-content")

        this.#subject.innerText = this.subject
        this.#sender.innerText = this.from
        this.#content.innerText = this.body

        this.target.addEventListener("click",()=>this.display())
    }

    display() {

        const container = document.querySelector("#content .container")
        const sub = container.querySelector(".content-subject")
        const to = container.querySelector(".content-to")
        const from = container.querySelector(".content-from")
        const body = container.querySelector(".content-body")

        sub.innerText = this.subject
        to.innerText = "To: me"
        from.innerText = "From: " + (this.email ? this.email : this.from.replaceAll(" ", "_") + "@example.com")
        body.innerText = this.body

        copyContentToOffcanvas()
    }
}

window.onresize = function (e) {
    if (window.innerWidth >= 576) {
        document.querySelector("#hamburger").click()
        document.querySelector("#close-content-offcanvas").click()
        addRemoveContentOpen(0)
    } else {
        addRemoveContentOpen(1)
    }
}

if (window.innerWidth < 576) {
    addRemoveContentOpen(1)
}

messagesArr.forEach(function (message) {
    message.onclick = () => setSelectedMessage(message)
})

inboxTabsArr.forEach(function (tab) {
    tab.onclick = () => setSelectedInbox(tab)
})

replyBtn.onclick = clearReply

searchContent.addEventListener("input",searchMessages)

document.querySelector("#compose-send").onclick = clearCompose

hamburger.onclick = openCloseSidebar

document.querySelectorAll(".message:not([data-example])").forEach(createEmail)

document.querySelector(".message[data-example]").email = new Email (
    document.querySelector(".message[data-example]"),
    "Connection Request","LinkedIn",
    "You Have A New Connection Request!",
    "noreply@linkedin.com"
)

copyContentToOffcanvas()


function setSelectedMessage(message) {
    clearReply(replyContent[1])
    messagesArr.forEach(e=>e.classList.remove("selected"))
    message.classList.add("selected")
}

function setSelectedInbox(tab) {
    inboxTabsArr.forEach(e=>e.classList.remove("selected"))
    tab.classList.add("selected")
}

function clearCompose() {
    document.querySelectorAll("#compose-to, #compose-subject").forEach(e=>e.value = "")
    document.querySelector("#compose-body").innerText = ""
}

function searchMessages() {

    const text = searchContent.value
    let hasMatch = false
    messagesArr.forEach(e=>{
        const content = {...e.email}
        delete content.target
        if (!text || Object.values(content).some(t=>t.match(new RegExp(text,"gi")))) {
            e.style.display = "flex"
            hasMatch = true
        } else {
            e.style.display = "none"
        }
    })
    if (!hasMatch) noMatches.style.display = "flex"
    else noMatches.style.display = "none"
}

function clearReply() {
    replyContent.value = ""
}

function openCloseSidebar() {
    sidebar.classList.toggle("open")

    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("col-sm-1")
        sidebar.classList.add("col-sm-2")
        content.classList.remove("col-sm-7")
        content.classList.add("col-sm-6")
    } else {
        sidebar.classList.add("col-sm-1")
        sidebar.classList.remove("col-sm-2")
        content.classList.add("col-sm-7")
        content.classList.remove("col-sm-6")
    }
}

function addRemoveContentOpen(val) {
    if (val) {
        messagesArr.forEach(e=>{
            e.setAttribute("data-bs-toggle","offcanvas")
            e.setAttribute("data-bs-target","#content-offcanvas")
        })
    } else {
        messagesArr.forEach(e=>{
            e.removeAttribute("data-bs-toggle")
            e.removeAttribute("data-bs-target")
        })
    }
}

function createEmail(target) {
    target.email = new Email (
        target,
        randomLorem(rand(1,4)),
        randomLorem(rand(1,3)),
        randomLorem(rand(10,200))
    )
}

function copyContentToOffcanvas() {
    document.querySelector("#content-offcanvas .offcanvas-body").innerHTML = document.querySelector("#content .container").innerHTML
}

function rand(min,max) {
    return Math.floor(Math.random() * (max-min)) + min
}

function randomLorem(wordCount) {
    let res = []

    const lorem = "Lorem ipsum dolor sit amet \
    consectetur adipisicing elit. Minus, \
    in alias earum tenetur maxime blanditiis \
    dolore molestiae, praesentium accusamus \
    magni corporis architecto iste repudiandae \
    officia aliquam repellat harum quidem voluptate! \
    Lorem ipsum dolor sit, amet consectetur \
    adipisicing elit. Reprehenderit similique \
    aliquam sequi, cumque expedita quaerat minus \
    alias eius porro inventore culpa mollitia, \
    sapiente voluptas blanditiis vero nam, magni \
    saepe dicta? Lorem, ipsum dolor sit amet \
    consectetur adipisicing elit. Nostrum \
    sapiente eligendi autem ipsa. Optio commodi \
    maxime nobis nulla earum corrupti eum voluptate \
    atque! Nemo pariatur ab quae quas? Lorem, ipsum \
    dolor sit amet consectetur adipisicing elit. \
    Voluptatibus, quos. Voluptatem magni numquam, \
    ipsa tempora porro, molestias accusamus et \
    quibusdam voluptatibus repellat maiores. \
    Nesciunt ipsum nam totam officiis ad dolor?".split(" ").filter(a=>a)

    while (res.length < wordCount) {
        const count = wordCount - res.length
        const min = Math.min(count,lorem.length)
        const rand = Math.floor(Math.random()*(lorem.length-min))
        res = res.concat(lorem.slice(rand,rand + min))

    }

    return res.join(" ")//lorem.splice(rand,wordCount).join(" ")
}