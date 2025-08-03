/**
 * Template Name: MyResume
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Updated: Jun 29 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

; (() => {
    // Import necessary libraries
    const AOS = window.AOS
    const PureCounter = window.PureCounter
    const Typed = window.Typed
    const GLightbox = window.GLightbox
    const Isotope = window.Isotope
    const Swiper = window.Swiper
    const grecaptcha = window.grecaptcha

    /**
     * Apply .scrolled class to the body as soon as the user scrolls down 100px from top
     */
    const selectBody = document.querySelector("body")
    if (selectBody) {
        const scrolled = () => {
            if (window.scrollY > 100) {
                selectBody.classList.add("scrolled")
            } else {
                selectBody.classList.remove("scrolled")
            }
        }
        document.addEventListener("load", scrolled)
        window.addEventListener("scroll", scrolled)
    }

    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector(".header-toggle")

    if (mobileNavToggleBtn) {
        mobileNavToggleBtn.addEventListener("click", function () {
            document.querySelector("body").classList.toggle("mobile-nav-active")
            this.classList.toggle("bi-list")
            this.classList.toggle("bi-x")
        })
    }

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll("#navmenu a").forEach((navmenu) => {
        navmenu.addEventListener("click", () => {
            if (document.querySelector(".mobile-nav-active")) {
                document.querySelector("body").classList.remove("mobile-nav-active")
                document.querySelector(".header-toggle").classList.toggle("bi-list")
                document.querySelector(".header-toggle").classList.toggle("bi-x")
            }
        })
    })

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll(".navmenu .toggle-dropdown").forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
            e.preventDefault()
            this.parentNode.classList.toggle("active")
            this.nextElementSibling.classList.toggle("dropdown-active")
            e.stopImmediatePropagation()
        })
    })

    /**
     * Preloader
     */
    const preloader = document.querySelector("#preloader")
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.remove()
        })
    }

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector(".scroll-top")
    if (scrollTop) {
        const togglescrollTop = () => {
            window.scrollY > 100 ? scrollTop.classList.add("active") : scrollTop.classList.remove("active")
        }
        window.addEventListener("load", togglescrollTop)
        document.addEventListener("scroll", togglescrollTop)
        scrollTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        })
    }

    /**
     * Animation on scroll function and init
     */
    function aos_init() {
        if (AOS) {
            AOS.init({
                duration: 800,
                easing: "slide",
                once: true,
                mirror: false,
            })
        }
    }
    window.addEventListener("load", () => {
        aos_init()
    })

    /**
     * Initiate Pure Counter
     */
    if (PureCounter) {
        new PureCounter()
    }

    /**
     * Initiate Typed.js
     */
    const selectTyped = document.querySelector(".typed")
    if (selectTyped && Typed) {
        let typed_strings = selectTyped.getAttribute("data-typed-items")
        typed_strings = typed_strings.split(",")
        new Typed(".typed", {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
        })
    }

    /**
     * GLightbox
     */
    const glightbox = document.querySelector(".glightbox")
    if (glightbox && GLightbox) {
        GLightbox({
            selector: ".glightbox",
        })
    }

    /**
     * Isotope Lightbox
     */
    const portfolioIsotope = document.querySelector(".isotope-layout")
    if (portfolioIsotope && Isotope) {
        const portfolioFilters = document.querySelector(".portfolio-filters li:first-child")
        if (portfolioFilters) {
            portfolioFilters.click()
        }
        const isotope = new Isotope(portfolioIsotope, {
            itemSelector: ".isotope-item",
            layoutMode: "masonry",
        })

        document.querySelectorAll(".portfolio-filters li").forEach((el) => {
            el.addEventListener(
                "click",
                function () {
                    document.querySelector(".portfolio-filters .filter-active").classList.remove("filter-active")
                    this.classList.add("filter-active")
                    isotope.arrange({
                        filter: this.getAttribute("data-filter"),
                    })
                    if (typeof aos_init === "function") {
                        aos_init()
                    }
                },
                false,
            )
        })
    }

    /**
     * Swiper JS
     */
    function initSwiper() {
        document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
            const config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim())
            if (Swiper) {
                new Swiper(swiperElement, config)
            }
        })
    }
    window.addEventListener("load", initSwiper)

    /**
     * PHP Email Form Validation
     */
    const phpEmailForm = document.querySelector(".php-email-form")
    if (phpEmailForm && grecaptcha) {
        phpEmailForm.addEventListener("submit", function (e) {
            e.preventDefault()

            const action = this.getAttribute("action")
            const recaptcha = this.getAttribute("data-recaptcha-site-key")

            if (!action) {
                this.querySelector(".loading").classList.add("d-none")
                this.querySelector(".error-message").innerHTML = "The form action property is not set!"
                return
            }
            this.querySelector(".loading").classList.remove("d-none")
            this.querySelector(".error-message").classList.add("d-none")
            this.querySelector(".sent-message").classList.add("d-none")

            const formData = new FormData(this)

            if (recaptcha) {
                grecaptcha.ready(() => {
                    grecaptcha
                        .execute(recaptcha, {
                            action: "php_email_form_submit",
                        })
                        .then((token) => {
                            formData.set("recaptcharesponse", token)
                            php_email_form_submit(this, action, formData)
                        })
                })
            } else {
                php_email_form_submit(this, action, formData)
            }
        })
    }

    function php_email_form_submit(thisForm, action, formData) {
        fetch(action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(`${response.status} ${response.statusText} ${response.url}`)
                }
            })
            .then((data) => {
                thisForm.querySelector(".loading").classList.add("d-none")
                if (data.success) {
                    thisForm.querySelector(".sent-message").classList.remove("d-none")
                    thisForm.reset()
                } else {
                    throw new Error(
                        data.message ? data.message : "Form submission failed and no error message returned from: " + action,
                    )
                }
            })
            .catch((error) => {
                thisForm.querySelector(".loading").classList.add("d-none")
                thisForm.querySelector(".error-message").innerHTML = error.message
                thisForm.querySelector(".error-message").classList.remove("d-none")
            })
    }
})()
