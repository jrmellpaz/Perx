import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

interface PerxShareSheetProps {
  title?: string;
  message?: string;
  url: string;
}

export function PerxShareSheet({ url, title, message }: PerxShareSheetProps) {
  return (
    <section className="flex flex-wrap gap-2 px-4">
      <FacebookShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        hashtag={`#PerxMerchant #Perx`}
        htmlTitle="Share your Perx Merchant account to Facebook"
      >
        <FacebookIcon className="size-12 rounded-full" />
      </FacebookShareButton>
      <TwitterShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title={message}
        htmlTitle="Share your Perx Merchant account to Twitter"
        hashtags={['PerxMerchant', 'Perx']}
      >
        <TwitterIcon className="size-12 rounded-full" />
      </TwitterShareButton>
      <EmailShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        subject={title}
        body={message}
        htmlTitle="Share your Perx Merchant account to Email"
      >
        <EmailIcon className="size-12 rounded-full" />
      </EmailShareButton>
      <LinkedinShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title={title}
        summary={message}
        source="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Linkedin"
      >
        <LinkedinIcon className="size-12 rounded-full" />
      </LinkedinShareButton>
      <TelegramShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Telegram"
      >
        <TelegramIcon className="size-12 rounded-full" />
      </TelegramShareButton>
      <ViberShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Viber"
      >
        <ViberIcon className="size-12 rounded-full" />
      </ViberShareButton>
      <WhatsappShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Whatsapp"
      >
        <WhatsappIcon className="size-12 rounded-full" />
      </WhatsappShareButton>
      <RedditShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Reddit"
      >
        <RedditIcon className="size-12 rounded-full" />
      </RedditShareButton>
      <ThreadsShareButton
        url={`${process.env.NEXT_PUBLIC_URL}${url}`}
        title="Perx Merchant"
        htmlTitle="Share your Perx Merchant account to Threads"
      >
        <ThreadsIcon className="size-12 rounded-full" />
      </ThreadsShareButton>
    </section>
  );
}
