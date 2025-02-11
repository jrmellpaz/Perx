"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";



export default function SignInWithFacebook() {
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient(); 
  const next = searchParams ? searchParams.get("next") : null;

  const signInWithFacebook = useCallback(async () => {
    setIsFacebookLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
          scopes: "public_profile email",
          queryParams: { auth_type: "rerequest" },
        },
      });

      if (error) {
        console.error("Error during sign-in:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsFacebookLoading(false); // Ensure loading state resets
    }
  }, [next]);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInWithFacebook}
      disabled={isFacebookLoading}
    >
      {isFacebookLoading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Image
          src="https://authjs.dev/img/providers/facebook.svg"
          alt="Facebook logo"
          width={20}
          height={20}
          className="mr-2"
        />
      )}{" "}
      Sign in with Facebook
    </Button>
  );
}
