
declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Esse *.svg significa que está pegando todos os arquivos que terminam com .svg e fazendo algo.