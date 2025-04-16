"use client";
import React from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { WavyBackground } from "@/components/ui/wavy-background";
import { APP_NAME } from "@/lib/constants";
import { useRouter } from "next/navigation";

const LoginForm = () => {

    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            
            setIsSubmitting(true);
            
            const formData = {
                username,
                password,
            }

            const response =  await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if(!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "An error occurred. Please try again.");
                return;
            }
            const data = await response.json();
            console.log("Response data:", data);

            router.push("/"); // Redirect to home page after successful login


        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }finally{
            setIsSubmitting(false);
        }


        console.log("Username:", username);

        
        console.log("Form submitted");
    };
    return (
        <WavyBackground
            colors={[
                'teal',
                'blue',
            ]}

            className="min-h-screen w-full flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to {APP_NAME}
            </h2>


            <form className="my-8 w-1/3" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="username" >Username</Label>
                    <Input id="username" placeholder="Enter your username" type="text" value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="Enter your password" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </LabelInputContainer>

                <button
                    className="group/btn cursor-pointer relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting ? "Logging In.." : "Log In"
                    }
                    
                    <BottomGradient />
                </button>



            </form>
        </WavyBackground>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};


export default LoginForm;