import { Feature } from '@/interfaces/Typings.d'
import React from 'react'

type Props = {
    feature: Feature
}

const FeatureCard = ({ feature }: Props) => {
    const { name, description, Icon } = feature
    return (
        <div className="flex flex-col items-center p-4">
            <Icon className="w-8 h-8 text-brand" />
            <h3 className="my-3 text-3xl font-semibold">{name}</h3>
            <p className='max-w-xs text-center text-gray-500 text-sm xl:text-base' >{description}</p>
        </div>
    )
}

export default FeatureCard