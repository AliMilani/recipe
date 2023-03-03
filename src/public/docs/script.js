function appendHeadingsHashLink() {
    const description = document.querySelector('.description')
    const headings = description.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const icon = '🔗'
    headings.forEach(function (heading) {
        const link = document.createElement('a')
        const tagId = heading.textContent.split(' ').join('-').toLowerCase()
        link.className = 'heading-hash-link'
        link.href = '#' + tagId
        link.id = tagId
        link.textContent = icon
        heading.appendChild(link)
    })
}
function waitForElm(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector))
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })
}

function removeLinkHashTargetBlank() {
    const links = document.querySelectorAll('.description a[href^="#"]')
    links.forEach((link) => {
        link.removeAttribute('target')
    })
}

// fix #/hash to #hash
function fixSwaggerRouterIdHash() {
    const url = window.location.hash
    // if url has #/{id} check if page has id scroll to it and remove the invalid hash
    if (url.includes('#/')) {
        const id = decodeURIComponent(url.split('#/')[1])
        const elm = document.getElementById(id)
        // const elm = document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        if (elm) {
            window.location = window.location.href.replace(url, '#' + id)
            console.log('scrolling to', id)
            // window.location.hash = id;
        }
    }
}
// function fixSwaggerRouterIdHash() {
//     const url = window.location.hash
//     // if url has #/{id} check if page has id scroll to it
//     if (url.includes('#/')) {
//         const id = url.split('#/')[1];
//         const elm = document.getElementById(decodeURIComponent(id));
//             console.log(elm)

//         if (elm) {
//             window.location =
//         }
//     }
// }
// fixSwaggerRouterIdHash()
function loadCdnScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}

// function getTryOutResponse() {
//     return new Promise((resolve) => {
//         xhook.after(function (request, response) {
//             console.log('request/response', request.headers.values(), response.headers.values())
//             resolve({ request, response })
//         })
//     })
// }

// function checkAccessToken() {
//     const accessToken = JSON.parse(localStorage.authorized).accessToken.value
//     if (accessToken) {
//         //check if token is valid
//         const isValid = jwt.verify(accessToken, process.env.JWT_SECRET)
//         if (isValid) {
//             //check if token is expired
//             const isExpired = jwt.decode(accessToken).exp < Date.now() / 1000
//             if (!isExpired) {
//                 //set authorization header
//                 const apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('Authorization', `Bearer ${accessToken}`, 'header')
//                 window.swaggerUi.api.clientAuthorizations.add('Authorization', apiKeyAuth)
//                 window.swaggerUi.api.clientAuthorizations.remove('api_key')
//             }
//         }
//     }
// }

function setTokenWithUi(key, value) {
    ui.preauthorizeApiKey(key, value)
}

function setTokenWithLocalStorage(key, value) {
    const authorized = JSON.parse(localStorage.authorized)
    authorized[key] = value
    localStorage.authorized = JSON.stringify(authorized)
}

function automaticSetAccessToken() {
    xhook.after(function (request, response) {
        if (request.url.includes('auth/signin')) {
            const accessToken = response.headers.get('x-access-token')
            if (accessToken) {
                console.log('accessToken', accessToken)
                //set authorization header
                // setTokenWithLocalStorage('accessToken', accessToken)
                setTokenWithUi('accessToken', accessToken)
            }
        }
    })
}

waitForElm('.description').then(async function (elm) {
    // await loadCdnScript('https://unpkg.com/xhook@latest/dist/xhook.min.js')

    // console.log(await getTryOutResponse());
    // automaticSetAccessToken()
    appendHeadingsHashLink()
    removeLinkHashTargetBlank()
    fixSwaggerRouterIdHash()
})
