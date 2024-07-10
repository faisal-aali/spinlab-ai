import user from "@/util/user";


export default function HeaderProfile() {

    return (
        <div className="blueBackground p-4 primary-border rounded-lg flex items-center justify-between w-3/5 mb-4 h-32">
            <div className="flex gap-5 items-center">
                <img src="/assets/hello-icon.png" className="w-11" alt="" />
                <div>
                    <h2 className="font-normal">
                        Hello <span className="font-semibold">{user.role === 'coach' ? 'Staff Name' : 'Faisal'}</span>
                    </h2>
                    <p className={`text-zinc-400 text-sm ${user.role === 'coach' && 'hidden'}`}>
                        Credits Available: <span className="text-primary">10</span>
                    </p>
                </div>
            </div>
            <div className={`flex space-x-4 ${user.role === 'coach' && 'hidden'}`}>
                <div className="primary-border-green flex items-center justify-center px-4 h-9 rounded-lg">
                    <p className="text-white text-sm">6'2"</p>
                </div>
                <div className="primary-border-green flex items-center justify-center px-4 h-9 rounded-lg">
                    <p className="text-white text-sm">200lbs</p>
                </div>
            </div>
        </div>
    )
}