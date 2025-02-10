'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import FacebookLogin, { SuccessResponse } from "@greatsumini/react-facebook-login";

export default function SignInWithFacebook() {
  const [message, setMessage] = useState<{ text: string, severity: "error" | "success" }>();
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false);

  const onSuccessHandler = async (response: SuccessResponse) => {
    setIsFacebookLoading(true);
    try {
      const apiResponse = await fetch("/api/facebook-login", {
        method: "POST",
        body: JSON.stringify({ userId: response.userID, accessToken: response.accessToken })
      });
      const data = await apiResponse.json();
      if (data.success) {
        setMessage({ text: "Login Successful.", severity: "success" });
      } else {
        setMessage({ text: "Login Failed.", severity: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error occurred", severity: "error" });
    } finally {
      setIsFacebookLoading(false);
    }
  };

  return (
    <div>
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
        onSuccess={onSuccessHandler}
        onFail={(error) => {
          setMessage({ text: "Error occurred", severity: "error" });
        }}
        render={({ onClick }) => (
          <Button
            type="button"
            variant="outline"
            onClick={onClick}
            disabled={isFacebookLoading}
            className="w-full"
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
        )}
      />
      {/* {message &&
        <div className={`${message.severity === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </div>
      } */}
    </div>
  );
}


