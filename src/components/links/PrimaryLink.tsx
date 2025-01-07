import Link from "next/link";

interface PrimaryLinkProps {
  children: React.ReactNode;
  href: string;
  title?: string;
  transparent?: boolean;
  className?: string;
}

const PrimaryLink: React.FC<PrimaryLinkProps> = ({
  children,
  className = "",
  href,
  title,
  transparent,
  ...props
}) => {
  return (
    <Link
      href={href}
      title={title}
      {...props}
      className={` py-2 md:py-3 px-5 md:px-7 rounded-full shadow-md border-2 border-accent-700 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-opacity-50 capitalize duration-300  ${
        transparent
          ? "bg-transparent text-accent-500 hover:bg-orange-600 hover:text-white"
          : "bg-accent-500 text-white"
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default PrimaryLink;
