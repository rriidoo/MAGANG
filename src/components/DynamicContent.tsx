import { useContentValue } from '../contexts/ContentContext';

interface DynamicContentProps {
  contentKey: string;
  defaultValue: string;
  type?: 'text' | 'image' | 'link';
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div' | 'a' | 'img';
  [key: string]: any;
}

export default function DynamicContent({
  contentKey,
  defaultValue,
  type = 'text',
  className = '',
  as,
  ...props
}: DynamicContentProps) {
  const value = useContentValue(contentKey, defaultValue);

  if (type === 'image') {
    return (
      <img
        src={value || defaultValue}
        alt={contentKey}
        className={className}
        {...props}
      />
    );
  }

  if (type === 'link') {
    return (
      <a
        href={value || defaultValue}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {value || defaultValue}
      </a>
    );
  }

  const Component = as || 'span';
  return (
    <Component className={className} {...props}>
      {value || defaultValue}
    </Component>
  );
}

