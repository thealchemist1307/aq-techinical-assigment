import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock constants
vi.mock("../constants", () => ({
  default: { baseUrl: "http://127.0.0.1:8000/" },
}));

// Mock toast functions from react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create a mock for useNavigate using async vi.importActual to retain BrowserRouter
const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    // Using data-testid queries to ensure unique identification
    const usernameInputs = screen.getAllByTestId("username-input-test");
    const usernameInput = usernameInputs[0];
    const passwordInputs = screen.getAllByTestId("password-input-test");
    const passwordInput = passwordInputs[0];
    const loginButtons = screen.getAllByTestId("login-button-test");
    const loginButton = loginButtons[0];

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("shows error toast on unsuccessful login", async () => {
    // Mock fetch to simulate a failed login response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ detail: "Invalid username or password!" }),
      }),
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const usernameInputs = screen.getAllByTestId("username-input-test");
    const usernameInput = usernameInputs[0];
    const passwordInputs = screen.getAllByTestId("password-input-test");
    const passwordInput = passwordInputs[0];
    const loginButtons = screen.getAllByTestId("login-button-test");
    const loginButton = loginButtons[0];

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid username or password!");
    });
  });

  it("stores tokens and navigates on successful login", async () => {
    // Mock fetch to simulate a successful login
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            refreshToken: "refresh123",
            accessToken: "access123",
            userName: "testuser",
          }),
      }),
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const usernameInputs = screen.getAllByTestId("username-input-test");
    const usernameInput = usernameInputs[0];
    const passwordInputs = screen.getAllByTestId("password-input-test");
    const passwordInput = passwordInputs[0];
    const loginButtons = screen.getAllByTestId("login-button-test");
    const loginButton = loginButtons[0];

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem("refreshToken")).toBe("refresh123");
      expect(localStorage.getItem("accessToken")).toBe("access123");
      expect(localStorage.getItem("userName")).toBe("testuser");
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows network error toast on fetch failure", async () => {
    // Mock fetch to simulate a network error
    global.fetch = vi.fn(() => Promise.reject(new Error("Network Error")));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const usernameInputs = screen.getAllByTestId("username-input-test");
    const usernameInput = usernameInputs[0];
    const passwordInputs = screen.getAllByTestId("password-input-test");
    const passwordInput = passwordInputs[0];
    const loginButtons = screen.getAllByTestId("login-button-test");
    const loginButton = loginButtons[0];

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Network error, please try again.",
      );
    });
  });

  it("navigates to register page when register button is clicked", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const registerButtons = screen.getAllByTestId("register-button-test");
    const registerButton = registerButtons[0];
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/register");
    });
  });
});
