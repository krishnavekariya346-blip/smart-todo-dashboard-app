import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        padding: 20,
    },

    center: {
        justifyContent: "center",
        alignItems: "center",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    spaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 10,
    },

    card: {
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        marginBottom: 15,
    },

    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    label: {
        fontWeight: "600",
        marginBottom: 6,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
});