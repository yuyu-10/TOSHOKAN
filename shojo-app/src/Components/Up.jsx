import up from "../img/up.png"

export const Up = () => {

    const scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop)
          window.scrollTo(0, c - c / 8)
        }
    }

    return (
        <div style={{ position: "fixed", bottom: "3vh", right: "3vh"}}>
            <img onClick={scrollToTop} style={{ width: "10vh"}} src={up} alt="" />
        </div>
    )
}