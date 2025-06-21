import {createAvatar} from '@dicebear/core';
import {botttsNeutral, initials} from '@dicebear/collection';
import {Avatar, AvatarImage,AvatarFallback} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';

interface GeneratedAvatarProps {
  className?: string;
  seed: string;
  variant?: 'botttsNeutral' | 'initials';
}

export const GeneratedAvatar = ({seed,className,variant}:GeneratedAvatarProps)=> {
  let avatar;

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed,})
    }
    else {
      avatar = createAvatar(initials, {
        seed,
        fontSize : 42,
        fontWeight: 500,})
      }
    return (
        <Avatar className={cn(className)}>
          <AvatarImage src={avatar.toDataUri()} alt='Avatar' />
          <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}