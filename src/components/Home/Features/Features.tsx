import { Feature } from '@/interfaces/Typings'
import React from 'react'
import { HiWrenchScrewdriver } from 'react-icons/hi2'
import { RiRobotFill, RiTeamFill } from 'react-icons/ri'
import { PiExamFill } from 'react-icons/pi'
import { MdExplore } from 'react-icons/md'
import { BiWorld } from 'react-icons/bi'
import FeatureCard from './FeatureCard'

const features: Feature[] = [
    {
        name: "Coustomize",
        description: "Frame words in your own way",
        Icon: HiWrenchScrewdriver
    },
    {
        name: "AI Assistance",
        description: "Generate meanings and examples for words using AI",
        Icon: RiRobotFill
    },
    {
        name: "Collaborate",
        description: "Invite friends to your board and compete with them",
        Icon: RiTeamFill
    },
    {
        name: "Test",
        description: "Take tests and quizzes based on the words you have learned",
        Icon: PiExamFill
    },
    {
        name: "Explore & Learn",
        description: "Explore the world of words, learn new words every day.",
        Icon: MdExplore
    },
    {
        name: "And much more...",
        description: "There are many more features to explore.",
        Icon: BiWorld
    }
]


const Features = () => {
    return (
        <section className="m-4 md:m-8">
            <div className="container mx-auto p-4 my-6 space-y-2 text-center">
                <h2 className="text-5xl font-bold">Why <span>Pin My Words?</span></h2>
                <p className="text-gray-500">
                    Explore all the features that Pin My Words has to offer.
                </p>
            </div>
            <div className="container mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {
                    features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))
                }
            </div>
        </section>
    )
}

export default Features