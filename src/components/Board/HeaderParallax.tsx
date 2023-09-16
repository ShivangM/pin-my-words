'use client'
import { Parallax } from 'react-parallax'

const HeaderParallax = ({ image, name }: { image: string | undefined, name: string }) => {
    return (
        <Parallax
            blur={{ min: -15, max: 15 }}
            bgImage={image || '/assets/board-placeholder.svg'}
            bgImageAlt={name}
            bgStyle={{ objectFit: 'cover' }}
            bgImageStyle={{ objectFit: 'cover' }}
            strength={-300}
        >
            <div style={{ height: '300px' }} />
        </Parallax>
    )
}

export default HeaderParallax