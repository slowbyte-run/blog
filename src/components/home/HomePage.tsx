import '@fortawesome/fontawesome-free/css/all.min.css';
import { homePageLinks, homePageProfile } from '../../config/homePageConfig';

interface SocialButton {
  href: string;
  gradient: string;
  shadow: string;
  icon: string;
  label: string;
  external?: boolean;
}

function getSocialButtons(links: typeof homePageLinks): SocialButton[] {
  return [
    {
      href: links.xUrl,
      gradient: 'from-[#111111] to-[#2a2a2a]',
      shadow: 'shadow-[0_4px_10px_rgba(17,17,17,0.3)]',
      icon: 'fa-brands fa-x-twitter',
      label: 'X',
      external: true,
    },
    {
      href: links.githubUrl,
      gradient: 'from-[#24292e] to-[#1f2327]',
      shadow: 'shadow-[0_4px_10px_rgba(36,41,46,0.3)]',
      icon: 'fa-brands fa-github',
      label: 'GitHub',
      external: true,
    },
    {
      href: links.cnblogsUrl,
      gradient: 'from-[#2f8b62] to-[#256b4a]',
      shadow: 'shadow-[0_4px_10px_rgba(47,139,98,0.35)]',
      icon: 'fa-solid fa-blog',
      label: '博客园',
      external: true,
    },
    {
      href: '/blog',
      gradient: 'from-[#ff7aa2] to-[#ff4f87]',
      shadow: 'shadow-[0_4px_10px_rgba(255,79,135,0.3)]',
      icon: 'fa-solid fa-pen-nib',
      label: '进入博客',
    },
  ];
}

interface HomePageProps {
  profile?: typeof homePageProfile;
  links?: typeof homePageLinks;
}

const HomePage = ({
  profile = homePageProfile,
  links = homePageLinks,
}: HomePageProps) => {
  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br">
      <div className="absolute inset-0">
        <div
          className="fixed inset-0 h-screen w-screen bg-cover bg-center bg-fixed opacity-70"
          style={{ backgroundImage: `url('${profile.backgroundUrl}')` }}
        />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[860px] flex-col px-5">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-[20px] border-2 border-pink-light bg-gradient-to-br from-white/95 to-pink-soft/95 p-6 shadow-pink-card backdrop-blur-md sm:p-10">
            <div className="flex justify-center">
              <div className="relative mb-6 h-[150px] w-[150px] rounded-full border-4 border-pink-border shadow-pink-avatar">
                <img
                  src={profile.avatarUrl}
                  alt={profile.avatarAlt}
                  className="h-full w-full rounded-full object-cover transition-transform duration-700 ease-in-out hover:rotate-[360deg]"
                />
              </div>
            </div>

            <div className="text-center">
              <h1
                className="text-[2.5rem] font-bold tracking-[1px] text-pink-main"
                style={{ textShadow: '2px 2px 8px rgba(255,105,180,0.3)' }}>
                {profile.name}
              </h1>
              <p className="mx-auto mt-3 max-w-[560px] px-5 text-[1.1rem] italic text-[#666]">
                {profile.tagline}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {getSocialButtons(links).map(
                ({ href, gradient, shadow, icon, label, external }) => (
                  <a
                    key={label}
                    className={`flex min-w-[200px] items-center justify-center gap-2 rounded-[25px] bg-gradient-to-r ${gradient} px-5 py-2.5 text-sm font-semibold text-white ${shadow} transition hover:-translate-y-0.5`}
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}>
                    <i className={`${icon} text-base`} aria-hidden="true" />
                    {label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <footer className="pb-6 text-center text-sm text-pink-main">
          {profile.footerText}
        </footer>
      </div>
    </section>
  );
};

export default HomePage;
