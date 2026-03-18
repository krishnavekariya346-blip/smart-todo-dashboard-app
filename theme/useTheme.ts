import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { darkColors, lightColors } from "./colors";

export const useTheme = () => {
    const { darkMode } = useContext(AuthContext);

    const colors = darkMode ? darkColors : lightColors;

    return { colors, darkMode };
};