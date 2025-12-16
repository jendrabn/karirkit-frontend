import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { setFormErrors } from "@/hooks/use-form-errors";

const GeneralErrorTest = () => {
  const testGeneralError = () => {
    // Simulate the error response structure
    const mockError = {
      response: {
        data: {
          general: ["User not found"],
        },
      },
    };

    // Manually trigger the error handling logic
    if (mockError.response?.data?.general) {
      const generalErrors = mockError.response.data.general;
      if (Array.isArray(generalErrors)) {
        generalErrors.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
      }
    }
  };

  const testMultipleGeneralErrors = () => {
    // Simulate multiple general errors
    const mockError = {
      response: {
        data: {
          general: [
            "User not found",
            "Invalid credentials",
            "Account suspended",
          ],
        },
      },
    };

    // Manually trigger the error handling logic
    if (mockError.response?.data?.general) {
      const generalErrors = mockError.response.data.general;
      if (Array.isArray(generalErrors)) {
        generalErrors.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
      }
    }
  };

  const testStringGeneralError = () => {
    // Simulate a string general error
    const mockError = {
      response: {
        data: {
          general: "Server error occurred",
        },
      },
    };

    // Manually trigger the error handling logic
    if (mockError.response?.data?.general) {
      const generalErrors = mockError.response.data.general;
      if (typeof generalErrors === "string") {
        toast.error(generalErrors);
      }
    }
  };

  const testFormValidationErrors = () => {
    // Simulate form validation errors from API
    const mockFormErrors = {
      email: ["Email is already registered"],
      password: ["Password is too weak"],
      username: ["Username already taken"],
    };

    // Set form errors using the hook
    setFormErrors(mockFormErrors);
    toast.info(
      "Form validation errors set. Check form fields for error messages."
    );
  };

  const testManualToast = () => {
    // Test manual toast to verify Sonner is working
    toast.error("This is a manual test error");
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>General Error Test</CardTitle>
          <CardDescription>
            Test the global error handling for "general" errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={testManualToast} variant="outline">
              Test Manual Toast
            </Button>
            <Button onClick={testGeneralError} variant="outline">
              Test Array General Error
            </Button>
            <Button onClick={testMultipleGeneralErrors} variant="outline">
              Test Multiple General Errors
            </Button>
            <Button onClick={testStringGeneralError} variant="outline">
              Test String General Error
            </Button>
            <Button
              onClick={testFormValidationErrors}
              variant="outline"
              className="md:col-span-2"
            >
              Test Form Validation Errors
            </Button>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Expected Behavior:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Manual Toast should show a toast immediately</li>
              <li>• Array General Error should show "User not found" toast</li>
              <li>• Multiple General Errors should show multiple toasts</li>
              <li>• String General Error should show a single toast</li>
              <li>
                • Form Validation Errors should set errors that appear in form
                fields
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralErrorTest;
