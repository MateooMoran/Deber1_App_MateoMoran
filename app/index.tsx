import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { evaluate } from "mathjs";
import FAB from "../components/FAB";
import { Colors } from "../constants/theme";  

//Tipos para dígitos y operadores
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Operator = "C" | "+/-" | "del" | "%" | "×" | "-" | "+" | "=" | ".";

// Componente Row para organizar botones en filas
const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
);

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0"); // Estado para el display
  const [result, setResult] = useState<string | null>(null); // Estado para el resultado parcial

  // Calcula el resultado parcial cada vez que cambia el display
  useEffect(() => {
    try {
      // Solo calcula si la expresión no termina en un operador
      if (!["+", "-", "×", "÷", "%"].includes(display.slice(-1))) {
        const expression = display.replace("×", "*").replace("÷", "/");
        const calculatedResult = evaluate(expression);
        setResult(calculatedResult.toString());
      } else {
        setResult(null); // No muestra resultado si la expresión no es válida
      }
    } catch (error) {
      setResult(null); // No muestra resultado si hay un error
    }
  }, [display]);

  // Maneja la pulsación de dígitos y operadores
  const onKey = (key: Digit | Operator) => {
    if (key === "C") {
      // Limpiar el display
      setDisplay("0");
    } else if (key === "+/-") {
      setDisplay((prev) => {
        const lastNumber = prev.split(/[-+×÷%]/).pop() || "0";
        const rest = prev.slice(0, prev.length - lastNumber.length);
        if (lastNumber.startsWith("-")) {
          return rest + lastNumber.slice(1);
        } else if (lastNumber !== "0") {
          return rest + "-" + lastNumber;
        }
        return prev;
      });
    } else if (key === "del") {
      // Borrar el último carácter
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (key === "=") {
      // Calcular el resultado final
      try {
        const expression = display.replace("×", "*").replace("÷", "/");
        const result = evaluate(expression); // Usa mathjs para evaluar
        setDisplay(result.toString());
      } catch (error) {
        setDisplay("Error");
      }
    } else if (key === ".") {
      // Añade punto decimal solo si no hay uno en el número actual
      if (!display.split(/[-+×÷%]/).pop()?.includes(".")) {
        setDisplay((prev) => (prev === "0" ? "0." : prev + key));
      }
    } else if (["+", "-", "×", "÷", "%"].includes(key)) {
      // Añade operador solo si el último carácter no es un operador
      if (!["+", "-", "×", "÷", "%"].includes(display.slice(-1))) {
        setDisplay((prev) => prev + key);
      }
    } else {
      // Añade dígito
      setDisplay((prev) => (prev === "0" ? key : prev + key));
    }
  };

  return (
    <View style={styles.container}>
      {/* Display de la calculadora */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
        {result !== null && (
          <Text style={styles.resultText}>{result}</Text>
        )}
      </View>

      {/* Botones organizados en filas */}
      <View style={styles.buttonContainer}>
        <Row>
          <FAB digit="C" onKey={onKey} bg={Colors.lightGray} color={Colors.background} />
          <FAB digit="+/-" onKey={onKey} bg={Colors.lightGray} color={Colors.background} />
          <FAB digit="del" onKey={onKey} bg={Colors.lightGray} color={Colors.background} />
          <FAB digit="%" onKey={onKey} bg={Colors.orange} color={Colors.textPrimary} />
        </Row>
        <Row>
          <FAB digit="7" onKey={onKey} />
          <FAB digit="8" onKey={onKey} />
          <FAB digit="9" onKey={onKey} />
          <FAB digit="×" onKey={onKey} bg={Colors.orange} color={Colors.textPrimary} />
        </Row>
        <Row>
          <FAB digit="4" onKey={onKey} />
          <FAB digit="5" onKey={onKey} />
          <FAB digit="6" onKey={onKey} />
          <FAB digit="-" onKey={onKey} bg={Colors.orange} color={Colors.textPrimary} />
        </Row>
        <Row>
          <FAB digit="1" onKey={onKey} />
          <FAB digit="2" onKey={onKey} />
          <FAB digit="3" onKey={onKey} />
          <FAB digit="+" onKey={onKey} bg={Colors.orange} color={Colors.textPrimary} />
        </Row>
        <Row>
          <FAB digit="0" onKey={onKey} extended size={64} extendedWidth={150} />
          <FAB digit="." onKey={onKey} />
          <FAB digit="=" onKey={onKey} bg={Colors.orange} color={Colors.textPrimary} />
        </Row>
      </View>
    </View>
  );
}

// Estilos para el layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: "flex-end",
  },
  displayContainer: {
    minHeight: 140, 
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  displayText: {
    color: Colors.textPrimary,
    fontSize: 64,
    fontWeight: "300",
  },
  resultText: {
    color: Colors.textSecondary, 
    fontSize: 24, 
    fontWeight: "300",
    marginTop: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
});