"use client"

import { InlineWidget } from "react-calendly";

export default function Calender() {

    return (
        <div className="flex flex-col">
            <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4 h-32">
                <div className="flex gap-5 items-center">
                    <div className="ml-4">
                        <h2 className="font-normal">Your Calender</h2>
                    </div>
                </div>
            </div>
            <div>
                <InlineWidget url="https://calendly.com/shaheer1642" />
            </div>
        </div>
    )
}