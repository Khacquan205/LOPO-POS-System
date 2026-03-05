declare module '@expo/vector-icons' {
  import { ComponentProps } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export class Ionicons extends React.Component<IconProps & { [key: string]: any }> {}
  export class MaterialIcons extends React.Component<IconProps & { [key: string]: any }> {}
  export class FontAwesome extends React.Component<IconProps & { [key: string]: any }> {}
  export class FontAwesome5 extends React.Component<IconProps & { [key: string]: any }> {}
  export class MaterialCommunityIcons extends React.Component<IconProps & { [key: string]: any }> {}
  export class Feather extends React.Component<IconProps & { [key: string]: any }> {}
  export class AntDesign extends React.Component<IconProps & { [key: string]: any }> {}
  export class Entypo extends React.Component<IconProps & { [key: string]: any }> {}
  export class EvilIcons extends React.Component<IconProps & { [key: string]: any }> {}
  export class Foundation extends React.Component<IconProps & { [key: string]: any }> {}
  export class Octicons extends React.Component<IconProps & { [key: string]: any }> {}
  export class SimpleLineIcons extends React.Component<IconProps & { [key: string]: any }> {}
  export class Zocial extends React.Component<IconProps & { [key: string]: any }> {}
}
