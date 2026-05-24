"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "auth_callback_failed") {
      const detail = searchParams.get("detail");
      setServerError(`Google sign-in failed: ${detail ?? "unknown error"}`);
    }
  }, [searchParams]);

  const isLogin = mode === "login";
  const schema = isLogin ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm | SignupForm>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginForm | SignupForm) {
    setServerError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const signupData = data as SignupForm;
        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: { display_name: signupData.displayName },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleGoogleLogin() {
    setServerError(null);
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/home`,
      },
    });
    if (error) {
      setServerError(error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <Card className="p-6">
      {/* Logo / Header */}
      <div className="mb-6 text-center">
        <h1 className="gradient-text text-2xl font-bold tracking-tight">
          Tralancherhawk
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isLogin ? "Welcome back 🌿" : "Start growing together 🌱"}
        </p>
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="mb-4 w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-slate-600">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {!isLogin && (
          <Input
            label="Display Name"
            placeholder="Your name"
            icon={<User className="h-4 w-4" />}
            error={(errors as { displayName?: { message?: string } }).displayName?.message}
            {...register("displayName" as keyof (LoginForm | SignupForm))}
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-8 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {serverError && (
          <p className="text-xs text-red-400 text-center">{serverError}</p>
        )}

        <Button type="submit" loading={isSubmitting} size="lg" className="mt-1 w-full">
          {isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        {isLogin ? (
          <>
            No account?{" "}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have one?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </>
        )}
      </p>
    </Card>
  );
}
