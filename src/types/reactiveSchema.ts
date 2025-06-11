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

  // Interfaz para información del dispositivo
export interface DeviceInfo {
    device: 'phone' | 'tablet' | 'desktop';
  }
  
  // Definición de tipos para respuestas multimedia
  export interface ResponseMedia {
    id: string;
    quantity: number;
  }