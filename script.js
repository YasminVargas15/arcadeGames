const cards = document.querySelectorAll('.card')

cards.forEach(card => {

    card.addEventListener('mousemove', (e) => {

        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / 12)
        const rotateY = ((centerX - x) / 12)

        card.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.03)
        `
    })

    card.addEventListener('mouseleave', () => {

        card.style.transform = `
            rotateX(0)
            rotateY(0)
            scale(1)
        `
    })
})

cards.forEach(card => {

    card.addEventListener('mousemove', e => {

        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        card.style.setProperty('--x', `${x}px`)
        card.style.setProperty('--y', `${y}px`)
    })
})