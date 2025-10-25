import { useState } from "react"

import Step1 from '@/components/forgotcomponent/Step1'
import { Step2 } from '@/components/forgotcomponent/Step2'
import Step3 from "@/components/forgotcomponent/Step3"
const ForgotPage = () => {

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    // 1️⃣ Create the form instance
    
    console.log("email",email);
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            {step === 1 && (
                <Step1  setEmail={setEmail} setStep={setStep} />
            )}
            {
                step === 2 && (
                    <Step2  email={email} setStep={setStep} />
                )
            }
            {
                step === 3 && (
                    <Step3 email={email} />
                )
            }
        </div>
    )
}

export default ForgotPage
