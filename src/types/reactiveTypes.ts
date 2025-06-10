import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeProps } from './uiTypes';
import { ReactiveSchema, DeviceInfo, ResponseMedia } from './reactiveSchema';

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
  images: MappedImage[];
  themeProps: ThemeProps;
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
  themeProps: ThemeProps;
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
  themeProps: ThemeProps;
  styles?: Reactive68Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
}

// Estilos para Reactive52
export interface Reactive52Styles {
  container?: ViewStyle;
  contentContainer?: ViewStyle;
  questionText?: TextStyle;
  titleText?: TextStyle;
  textContainer?: ViewStyle;
  imageContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
  alternativesContainer?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  twoColumnsRow?: ViewStyle;
  defaultRow?: ViewStyle;
}

// Props para Reactive52
export interface Reactive52Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive52Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
  resetTrigger?: number;
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
  themeProps: ThemeProps;
  styles?: Reactive42Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
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
  images: MappedImage[];
  responseUser: string[];
  onResponseChange: (updatedResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  themeProps: ThemeProps;
  styles?: Reactive38Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
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
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive25Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
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
  inputContainerCorrect?: ViewStyle;
  inputContainerIncorrect?: ViewStyle;
  row?: ViewStyle;
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
  images?: MappedImage[];
  themeProps: ThemeProps;
  deviceInfo?: DeviceInfo;
  styles?: Reactive20Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
}

// Estilos para Reactive40
export interface Reactive40Styles {
  container?: ViewStyle;
  questionContainer?: ViewStyle;
  questionText?: TextStyle;
  imageContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
  alternativesContainer?: ViewStyle;
  twoColumnsRow?: ViewStyle;
  defaultRow?: ViewStyle;
  alternativeWrapper?: ViewStyle;
  alternativeWrapperColumn?: ViewStyle;
}

export type UserResponseStatus = 'pending' | 'correct' | 'incorrect';

// ===== Tipos utilitarios comunes =====
export interface MappedImage {
  id: string;
  label: string;
  url: string;
  quantity: number;
}

// ===== Props para Reactive1 =====
export interface Reactive1Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  themeProps: ThemeProps;
  deviceInfo: DeviceInfo;
  styles?: Reactive1Styles;
  containerStyle?: ViewStyle;
}

// ===== Props para Reactive2 =====
export interface Reactive2Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  themeProps: ThemeProps;
  styles?: Reactive2Styles;
  containerStyle?: ViewStyle;
}

// ===== Props para Reactive3 =====
export interface Reactive3Props {
  reactive: ReactiveSchema;
  responseUser: ResponseMedia[];
  onResponseChange: (updatedResponse: ResponseMedia[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  themeProps: ThemeProps;
  styles?: Reactive3Styles;
  containerStyle?: ViewStyle;
  images: MappedImage[];
  width?: number;
  height?: number;
}

// ===== Props para Reactive7 =====
export interface Reactive7Props {
  reactive: ReactiveSchema;
  responseUser: ResponseMedia[];
  onResponseChange: (updatedResponse: ResponseMedia[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive7Styles;
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
}

// ===== Props para Reactive12 =====
export interface Reactive12Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus?: 'pending' | 'correct' | 'incorrect';
  resetTrigger?: number;
  onCorrectOrderChange?: (correctOrder: string[]) => void;
  themeProps: ThemeProps;
  styles?: Reactive12Styles;
  containerStyle?: ViewStyle;
}

// ===== Estilos y Props para Reactive18 =====
export interface Reactive18Styles {
  container?: ViewStyle;
  titleText?: TextStyle;
  operationContainer?: ViewStyle;
  operationText?: TextStyle;
  touchableInput?: ViewStyle;
  inputContainerFocused?: ViewStyle;
  errorText?: TextStyle;
}

export interface Reactive18Props {
  reactive: ReactiveSchema;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  keyValue: string;
  setKey: (key: string) => void;
  inputId: string;
  isFocused: boolean;
  setFocusId: (id: string | null) => void;
  themeProps: ThemeProps;
  styles?: Reactive18Styles;
  containerStyle?: ViewStyle;
}

// ===== Estilos y Props para Reactive21 =====
export interface Reactive21Styles {
  container?: ViewStyle;
  titleText?: TextStyle;
  imagesContainer?: ViewStyle;
  imageWrapper?: ViewStyle;
  image?: ImageStyle;
  operationContainer?: ViewStyle;
  operationSymbol?: TextStyle;
  inputButton?: ViewStyle;
  inputFocused?: ViewStyle;
  imageCircle?: ViewStyle;
  feedbackContainer?: ViewStyle;
  feedbackText?: TextStyle;
}

export interface Reactive21Props {
  reactive: ReactiveSchema;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  numericResponse: { first: string; second: string; result: string };
  focusedInput: 'first' | 'second' | 'result' | null;
  onNumericChange: (newResponse: { first: string; second: string; result: string }) => void;
  setFocusedInput: (field: 'first' | 'second' | 'result' | null) => void;
  imageUrl: string;
  themeProps: ThemeProps;
  styles?: Reactive21Styles;
  containerStyle?: ViewStyle;
  screenWidth?: number;
}

// ===== Props para Reactive40 =====
export interface Reactive40Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive40Styles;
  containerStyle?: ViewStyle;
  resetTrigger?: number;
}

// ===== Estilos y Props para Reactive58 =====
export interface Reactive58Styles {
  // Solo definimos los contenedores clave usados en el componente
  container?: ViewStyle;
  buttonContainer?: ViewStyle;
  alternativesContainer?: ViewStyle;
  noAlternativesContainer?: ViewStyle;
  noAlternativesText?: TextStyle;
}

export interface Reactive58Props {
  reactive: ReactiveSchema;
  responseUser: string[];
  onResponseChange: (newResponse: string[]) => void;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  images: MappedImage[];
  themeProps: ThemeProps;
  styles?: Reactive58Styles;
  containerStyle?: ViewStyle;
}

// ===== Props para NoReactive (Componente placeholder)
export interface NoReactiveProps {
  themeProps?: ThemeProps;
}

// ===== Tipos utilitarios internos =====

// Para Reactive20
export interface ImageCardProps {
  img: { name: string; url: string };
  quantity: number;
  cardStyle?: ViewStyle;
  imagesGridStyle?: ViewStyle;
  imageWrapperStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  theme: ThemeProps;
}

export interface ImageResponse {
  id: string;
  quantity: number;
}

export interface ReactiveContentWithImages {
  text?: { response?: string[] };
  images?: { response?: ImageResponse[] };
}

// Para Reactive12 (drag & drop)
export interface DraggableProps {
  value: string;
  onDragStart: (value: string) => void;
  disabled?: boolean;
  styles?: Reactive12Styles;
  themeProps: ThemeProps;
}

export interface DropZoneProps {
  index: number;
  value: string | null;
  onDrop: (index: number) => void;
  onDragOver: () => void;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  correctValue?: string;
  userResponseStatus: 'pending' | 'correct' | 'incorrect';
  styles?: Reactive12Styles;
  themeProps: ThemeProps;
} 