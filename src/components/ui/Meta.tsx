import Head from 'next/head'
import { FC, PropsWithChildren } from 'react'
import logoImage from './assets/images/logo.svg'
import { useRouter } from 'next/router'

interface ISeo {
    title: string
    description?: string
    image?: string
}

export const titleMerge = (title: string) => `${title} | Keystore`

const Meta: FC<PropsWithChildren<ISeo>> = ({
    title,
    description,
    image,
    children
}) => {
    const {asPath} = useRouter()
    const currentUrl = `${process.env.APP_URL}${asPath}`
    return (
        <>
        <Head>
            <title itemProp = 'headline'>{titleMerge(title)}</title>
            {description? (
                <>
                <meta
                itemProp = 'description'
                name = 'description'
                content={description}
                />
                <link rel = 'canonical' href ={currentUrl}/>
                <meta property='og:locate' content='en'/>
                <meta property='og:title' content={titleMerge (title)} />
                <meta property='og:url' content={currentUrl} />
                <meta property='og:image' content={image || '/logo.svg'} />
                <meta property='og:description' content={description} />
</>
            ):(
                <meta name='robots' content = 'noindex, nofollow' />
            )}
            </Head>
            {children}
            </>
    )
}
export default Meta