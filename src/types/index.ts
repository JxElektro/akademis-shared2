import { ViewStyle, TextStyle, ImageStyle } from 'react-native';


// Interfaz para propiedades de tema
export interface ThemeProps {
  colors: {
    primary: {
      main: string;
      light: string;
      lighter?: string;
      dark: string;
      lightest?: string;
    };
    neutral: {
      white: string;
      gray100?: string;
      gray200?: string;
      gray300?: string;
      gray400?: string;
      gray500?: string;
    };
    feedback: {
      success: {
        main: string;
        light: string;
        dark: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
      };
      warning?: {
        main: string;
        light: string;
        dark: string;
      };
      info?: {
        main: string;
        light: string;
        dark: string;
      };
    };
    ui?: {
      button: string;
    };
    state?: {
      default: string;
      selected?: string;
      focused?: string;
      disabled?: string;
      correct?: string;
      incorrect?: string;
      pending?: string;
    };
  };
  typography: {
    fontSize: {
      base: number;
      lg: number;
      xl: number;
      sm?: number;
      md?: number;
    };
    fontWeight: {
      semibold: "600" | 600;
      bold: "700" | 700;
      normal?: "400" | 400;
    };
    fontFamily: string;
  };
  spacing: number[];
  borders: {
    radius: {
      lg: number;
      md: number;
      sm?: number;
    };
    width: {
      normal: number;
      thin?: number;
      medium?: number;
      thick?: number;
    };
  };
  shadows: {
    md: any; // Tipo simplificado para sombras
  };
  animations: {
    opacity: {
      pressed: number;
      disabled?: number;
      normal?: number;
    };
    scale?: {
      pressed?: number;
      normal?: number;
    };
  };
  sizes?: {
    squareButton?: {
      small: { height: number };
      medium: { height: number };
      large: { height: number };
    };
  };
  // Colores Akademi para compatibilidad
  AkademiColors?: {
    azulPrincipal: string;
    verdeAkademi: string;
    amarilloAkademi: string;
    azulClaro: string;
    rojoAkademi: string;
    turquesa: string;
  };
}

// Interfaz para información del dispositivo
export interface DeviceInfo {
  device: 'phone' | 'tablet' | 'desktop';
}

// Definición de tipos para respuestas multimedia
export interface ResponseMedia {
  id: string;
  quantity: number;
}

// Esquema para componentes reactivos
export interface ReactiveSchema {
  alternatives?: {
    config?: {
      content?: Array<{
        images?: {
          response?: ResponseMedia[];
          correctResponse?: ResponseMedia[];
        };
        text?: {
          response?: string[];
          correctResponse?: string[];
        };
        number?: {
          response?: (string | number)[];
          correctResponse?: (string | number)[];
        };
      }>;
    };
  };
  assignment?: {
    config?: {
      content?: Array<{
        text?: {
          response?: string[];
        };
        images?: {
          response?: ResponseMedia[];
        };
      }>;
    };
  };
  info?: {
    config?: {
      content?: Array<{
        text?: {
          response?: string[];
        };
      }>;
    };
  };
  correctAlternative?: {
    inputType?: {
      config?: {
        content?: Array<{
          images?: {
            response?: ResponseMedia[];
          };
        }>;
      };
    };
  };
  // Añadir otras propiedades según sea necesario
}

// Base de estilos para todos los reactivos
export interface BaseReactiveStyles {
  container?: ViewStyle;
  loadingContainer?: ViewStyle;
  errorText?: TextStyle;
  title?: TextStyle;
}

// Estilos para Reactive1
export interface Reactive1Styles extends BaseReactiveStyles {
  alternativesContainer?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  row?: ViewStyle;
  twoColumnsRow?: ViewStyle;
  threeColumnsRow?: ViewStyle;
}

// Estilos para Reactive2
export interface Reactive2Styles extends BaseReactiveStyles {
  container?: ViewStyle;
  containerMobile?: ViewStyle;
  containerLandscape?: ViewStyle;
  alternativesContainer?: ViewStyle;
  alternativesContainerMobile?: ViewStyle;
  alternativesContainerLandscape?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  alternativeWrapperMobile?: ViewStyle;
  errorText?: TextStyle;
}

// Estilos para Reactive3
export interface Reactive3Styles extends BaseReactiveStyles {
  cardsContainer?: ViewStyle;
  card?: ViewStyle;
  selectedCard?: ViewStyle;
  correctCard?: ViewStyle;
  incorrectCard?: ViewStyle;
  image?: ImageStyle;
  statusContainer?: ViewStyle;
  statusText?: TextStyle;
}

// Estilos para Reactive7
export interface Reactive7Styles extends BaseReactiveStyles {
  contentContainer?: ViewStyle;
  scrollViewContainer?: ViewStyle;
  scrollViewContent?: ViewStyle;
  cardsContainer?: ViewStyle;
  card?: ViewStyle;
  selectedCard?: ViewStyle;
  correctCard?: ViewStyle;
  incorrectCard?: ViewStyle;
  imagesGrid?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  statusContainer?: ViewStyle;
  statusText?: TextStyle;
}

// Estilos para Reactive12
export interface Reactive12Styles extends BaseReactiveStyles {
  dropZonesRow?: ViewStyle;
  dropZone?: ViewStyle;
  correctDropZone?: ViewStyle;
  incorrectDropZone?: ViewStyle;
  dropZoneText?: TextStyle;
  placeholderText?: TextStyle;
  alternativesContainer?: ViewStyle;
  item?: ViewStyle;
  disabledItem?: ViewStyle;
  itemText?: TextStyle;
}

// Define una interfaz para los estilos personalizados que se pueden pasar a los reactivos
export interface ReactiveStyleProps {
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  container?: ViewStyle;
  card?: ViewStyle;
  selectedCard?: ViewStyle;
  correctCard?: ViewStyle;
  incorrectCard?: ViewStyle;
  [key: string]: any; // Permitir cualquier otra propiedad de estilo
}

// Props para Reactive71
export interface Reactive71Styles {
  container?: ViewStyle;
  containerMobile?: ViewStyle;
  containerLandscape?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  alternativeWrapperLandscape?: ViewStyle;
  defaultRow?: ViewStyle;
  defaultRowLandscape?: ViewStyle;
  twoColumnsRow?: ViewStyle;
  twoColumnsRowLandscape?: ViewStyle;
  threeColumnsRow?: ViewStyle;
  threeColumnsRowLandscape?: ViewStyle;
  infoTitle?: TextStyle;
  buttonContainer?: ViewStyle;
  buttonContainerMobile?: ViewStyle;
  noImageText?: TextStyle;
  alternativesContainer?: ViewStyle;
  alternativesContainerMobile?: ViewStyle;
  alternativesContainerLandscape?: ViewStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
}

export interface Reactive71Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  styles?: any; // Puede ser Reactive71Styles si se define, o usar any temporalmente
  containerStyle?: ViewStyle;
}

// Props para Reactive70
export interface Reactive70Styles {
  container?: ViewStyle;
  containerMobile?: ViewStyle;
  containerLandscape?: ViewStyle;
  titleText?: TextStyle;
  titleTextMobile?: TextStyle;
  sentenceContainer?: ViewStyle;
  sentenceContainerMobile?: ViewStyle;
  sentenceText?: TextStyle;
  sentenceTextMobile?: TextStyle;
  operationContainer?: ViewStyle;
  operationContainerMobile?: ViewStyle;
  operationText?: TextStyle;
  operator?: TextStyle;
  interactiveSquare?: ViewStyle;
  interactiveSquareFocused?: ViewStyle;
  errorText?: TextStyle;
}

export interface Reactive70Props {
  reactive: ReactiveSchema;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  keyValue: string;
  setKey: (key: string) => void;
  inputId: string;
  isFocused: boolean;
  setFocusId: (id: string | null) => void;
  styles?: any; // Puede ser Reactive70Styles si se define, o usar any temporalmente
  containerStyle?: ViewStyle;
}

// Estilos para Reactive68
export interface Reactive68Styles {
  container?: ViewStyle;
  containerMobile?: ViewStyle;
  containerDesktop?: ViewStyle;
  contentContainer?: ViewStyle;
  contentContainerMobile?: ViewStyle;
  contentContainerDesktop?: ViewStyle;
  textContainer?: ViewStyle;
  titleText?: TextStyle;
  text?: TextStyle;
  underlinedText?: TextStyle;
  alternativesContainer?: ViewStyle;
  alternativesContainerMobile?: ViewStyle;
  alternativesContainerDesktop?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  alternativeWrapperMobile?: ViewStyle;
  twoColumnsRow?: ViewStyle;
  defaultRow?: ViewStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
}

// Props para Reactive68
export interface Reactive68Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  styles?: Reactive68Styles;
  containerStyle?: ViewStyle;
}

// Estilos para Reactive52
export interface Reactive52Styles {
  container?: ViewStyle;
  questionText?: TextStyle;
  imageContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
  alternativesContainer?: ViewStyle;
}

// Props para Reactive52
export interface Reactive52Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  styles?: Reactive52Styles;
  containerStyle?: ViewStyle;
}

// Estilos para Reactive42
export interface Reactive42Styles {
  container?: ViewStyle;
  title?: TextStyle;
  topRow?: ViewStyle;
  dropZone?: ViewStyle;
  dropZoneActive?: ViewStyle;
  dropZoneFilled?: ViewStyle;
  dropZoneFilledActive?: ViewStyle;
  dropContent?: ViewStyle;
  placeholder?: TextStyle;
  bottomContainer?: ViewStyle;
  scrollRow?: ViewStyle;
  scrollContentContainer?: ViewStyle;
  draggableRow?: ViewStyle;
  draggableBox?: ViewStyle;
  dragging?: ViewStyle;
  dragReleased?: ViewStyle;
  selectedSyllable?: ViewStyle;
  syllableText?: TextStyle;
  dropZoneFilledText?: TextStyle;
  draggableBoxText?: TextStyle;
  instruction?: TextStyle;
}

// Props para Reactive42
export interface Reactive42Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (updatedResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  styles?: Reactive42Styles;
  containerStyle?: ViewStyle;
}

// Estilos para Reactive38
export interface Reactive38Styles {
  container?: ViewStyle;
  title?: TextStyle;
  topRow?: ViewStyle;
  dropZone?: ViewStyle;
  dropZoneActive?: ViewStyle;
  dropContent?: ViewStyle;
  placeholder?: TextStyle;
  startButton?: ViewStyle;
  startText?: TextStyle;
  bottomContainer?: ViewStyle;
  scrollRow?: ViewStyle;
  scrollContentContainer?: ViewStyle;
  draggableRow?: ViewStyle;
  draggableBox?: ViewStyle;
  dragging?: ViewStyle;
  image?: ImageStyle;
}

// Props para Reactive38
export interface Reactive38Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (updatedResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  styles?: Reactive38Styles;
  containerStyle?: ViewStyle;
}

// Estilos para Reactive25
export interface Reactive25Styles {
  container?: ViewStyle;
  loadingContainer?: ViewStyle;
  errorText?: TextStyle;
  title?: TextStyle;
  imagesContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  selectedImageWrapper?: ViewStyle;
  correctImageWrapper?: ViewStyle;
  incorrectImageWrapper?: ViewStyle;
  pressedImageWrapper?: ViewStyle;
  image?: ImageStyle;
}

// Props para Reactive25
export interface Reactive25Props {
  reactive: ReactiveSchema;
  responseUser: ResponseMedia[];
  onResponseChange: (updatedResponse: ResponseMedia[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  styles?: Reactive25Styles;
  containerStyle?: ViewStyle;
}

// Estilos para Reactive20
export interface Reactive20Styles {
  container?: ViewStyle;
  titleText?: TextStyle;
  fullOperationContainer?: ViewStyle;
  operatorContainer?: ViewStyle;
  operatorText?: TextStyle;
  card?: ViewStyle;
  imagesGrid?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  activityIndicator?: ViewStyle;
  equalSign?: TextStyle;
  touchableInput?: ViewStyle;
  inputContainerFocused?: ViewStyle;
}

// Props para Reactive20
export interface Reactive20Props {
  reactive: ReactiveSchema;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  keyValue: string;
  setKey: (key: string) => void;
  inputId: string;
  isFocused: boolean;
  setFocusId: (id: string | null) => void;
  images?: any[]; // MappedImage[] pero puede variar
  themeProps?: ThemeProps;
  deviceInfo?: DeviceInfo;
  styles?: Reactive20Styles;
  containerStyle?: ViewStyle;
}

export type UserResponseStatus = 'pending' | 'correct' | 'incorrect'; 