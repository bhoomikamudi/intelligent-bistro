import { useEffect, useState } from "react";
import { View } from "react-native";

export function TypingIndicator() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <View className="flex-row items-center gap-1.5 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          className="h-2 w-2 rounded-full bg-stone-400"
          style={{ opacity: step === i ? 1 : 0.25 }}
        />
      ))}
    </View>
  );
}
