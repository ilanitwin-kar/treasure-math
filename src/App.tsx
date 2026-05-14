import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { TreasureMapScreen } from "./screens/TreasureMapScreen";
import { QuestionScreen } from "./screens/QuestionScreen";
import { PauseScreen } from "./screens/PauseScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { TeacherDashboardScreen } from "./screens/TeacherDashboardScreen";
import { IntroStoryScreen } from "./screens/IntroStoryScreen";
import { useGameStore } from "./store/gameStore";
import { SpeechProvider } from "./hooks/useSpeech";
import { GlobalSpeechMute } from "./components/GlobalSpeechMute";
import { ProfileEditModal } from "./components/ProfileEditModal";

function App() {
  const hydrate = useGameStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <SpeechProvider>
      <div className="min-h-0 min-h-[100dvh] w-full relative">
        <GlobalSpeechMute />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/map" element={<TreasureMapScreen />} />
          <Route path="/question" element={<QuestionScreen />} />
          <Route path="/pause" element={<PauseScreen />} />
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/teacher" element={<TeacherDashboardScreen />} />
          <Route path="/intro" element={<IntroStoryScreen />} />
        </Routes>
        <ProfileEditModal />
      </div>
      </SpeechProvider>
    </BrowserRouter>
  );
}

export default App;
