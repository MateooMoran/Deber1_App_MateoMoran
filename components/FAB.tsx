import React, { memo, useState } from "react";
import * as Haptics from "expo-haptics";
import {Colors} from '../constants/theme';

import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Operator = "C" | "+/-" | "del" | "%" | "×" | "-" | "+" | "=" | ".";

export interface FABProps
  extends Omit<PressableProps, "onPress" | "children" | "style"> {
  digit: Digit | Operator; // dígito que emite
  onKey: (digit: Digit | Operator) => void; // callback
  label?: string; // por si quieres mostrar algo distinto
  size?: number; // diámetro (circular) o alto (extendido)
  extended?: boolean; // para el "0" ancho doble
  extendedWidth?: number; // Ancho personalizado
  bg?: string; // color de fondo
  bgOp?:string;  //Color de fondo para operadores
  color?: string; // color de texto
  style?: ViewStyle;
}

const FAB = memo(function FAB({
  digit,
  onKey,
  label,
  size = 64,
  extended = false,
  extendedWidth = size * 2,
  bg = Colors.darkGray,
  bgOp = Colors.lightGray,
  color = Colors.textPrimary,
  style,
  ...rest
}: FABProps) {
  const [pressed, setPressed] = useState(false);


  // Expo - Haptics
  // Brandon Mateo Moran Muñoz
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
    onKey(digit); 
  };

  const shape: ViewStyle = extended
    ? { height: size, width: extendedWidth, borderRadius: size / 2 } 
    : { width: size, height: size, borderRadius: size / 2 };

  return (
    <Pressable
      onPress={handlePress} 
      onPressIn={() => setPressed(true)} 
      onPressOut={() => setPressed(false)} 
      android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: false }} 
      accessibilityLabel={`Dígito ${label ?? digit}`} 
      style={[
        styles.base, 
        shape, 
        { backgroundColor: bg }, 
        pressed && { opacity: 0.7 }, 
        style, 
      ]}
      {...rest} 
    >
      <Text
        style={[
          styles.label, 
          { color, fontSize: Math.min(22, size * 0.35) }, 
        ]}
      >
        {label ?? digit} 
      </Text>
    </Pressable>
  );
});

// Estilos para el componente
const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center", 
    overflow: "hidden", 
  },
  label: {
    fontWeight: "600", 
  },
});

export default FAB;