import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate } from "react-router";
import { createOrder, fetchMenu, type MenuItem } from "../../api/client";
import { conversationFlow } from "../../constants/q-and-a";
import ChatGate from "./ChatGate";
import ConnectionNotice from "./ConnectionNotice";
import MenuSelection from "./MenuSelection";

enum OrderStep {
  Chat,
  ConnectionNotice,
  Menu,
}

const STEP_SEQUENCE: OrderStep[] = [
  OrderStep.Chat,
  OrderStep.ConnectionNotice,
  OrderStep.Menu,
];

type StepConfig = {
  id: OrderStep;
  render: () => JSX.Element;
};

type OrderPageManagerProps = {
  storeId: string;
  clientKey: string;
};

export default function OrderPageManager({ storeId, clientKey }: OrderPageManagerProps) {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [testModeEnabled, setTestModeEnabled] = useState(false);
  const [canToggleTestMode, setCanToggleTestMode] = useState(false);

  const currentStep = STEP_SEQUENCE[currentStepIndex];
  const worstUIEnabled = !testModeEnabled;

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEP_SEQUENCE.length - 1));
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const loadMenu = useCallback(async () => {
    if (!storeId) return;
    setMenuLoading(true);
    setMenuError(null);
    try {
      const items = await fetchMenu(storeId, clientKey);
      setMenu(items);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : String(error));
    } finally {
      setMenuLoading(false);
    }
  }, [storeId, clientKey]);

  useEffect(() => {
    if (currentStep === OrderStep.Menu) {
      if (menu.length === 0 && !menuLoading) {
        void loadMenu();
      }
      return;
    }

    if (selectedMenuId !== null) setSelectedMenuId(null);
    if (submitError) setSubmitError(null);
    if (submitting) setSubmitting(false);
  }, [
    currentStep,
    loadMenu,
    menu.length,
    menuLoading,
    selectedMenuId,
    submitError,
    submitting,
  ]);

  const handleOrderSubmit = useCallback(async () => {
    if (!storeId || !selectedMenuId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await createOrder(storeId, selectedMenuId, clientKey);
      navigate(`/order/${storeId}/receipt/${order.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }, [navigate, selectedMenuId, storeId, clientKey]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const query = window.matchMedia("(pointer: fine)");
    const update = (event: MediaQueryListEvent) => {
      setCanToggleTestMode(event.matches);
    };
    setCanToggleTestMode(query.matches);
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => {
        query.removeEventListener("change", update);
      };
    }
    query.addListener(update);
    return () => {
      query.removeListener(update);
    };
  }, []);

  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: OrderStep.Chat,
        render: () => (
          <ChatGate
            flow={conversationFlow}
            onComplete={() => {
              goToNextStep();
            }}
            worstUIEnabled={worstUIEnabled}
            testMode={testModeEnabled}
          />
        ),
      },
      {
        id: OrderStep.ConnectionNotice,
        render: () => (
          <ConnectionNotice
            onConfirm={() => {
              goToNextStep();
            }}
            onBack={() => {
              goToPrevStep();
            }}
            worstUIEnabled={worstUIEnabled}
          />
        ),
      },
      {
        id: OrderStep.Menu,
        render: () => (
          <MenuSelection
            menu={menu}
            loading={menuLoading}
            error={menuError}
            onRetry={loadMenu}
            selectedMenuId={selectedMenuId}
            onSelect={setSelectedMenuId}
            onSubmit={handleOrderSubmit}
            submitting={submitting}
            orderError={submitError}
            worstUIEnabled={worstUIEnabled}
          />
        ),
      },
    ],
    [
      goToNextStep,
      goToPrevStep,
      handleOrderSubmit,
      loadMenu,
      menu,
      menuError,
      menuLoading,
      selectedMenuId,
      submitting,
      submitError,
      testModeEnabled,
      worstUIEnabled,
    ],
  );

  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-start p-4 bg-worst">
      <h1 className="text-center text-2xl font-bold text-worst-primary">
        かき氷注文システム
      </h1>
      {canToggleTestMode && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setTestModeEnabled((prev) => !prev)}
            aria-pressed={testModeEnabled}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            title="PC接続時のみ表示されるテスト用トグルです"
          >
            <span>UIテストモード</span>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                testModeEnabled ? "bg-emerald-500" : "bg-gray-400"
              }`}
              aria-hidden="true"
            />
            <span>{testModeEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>
      )}
      {activeStep?.render()}
    </main>
  );
}
