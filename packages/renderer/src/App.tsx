import React from 'react';
import './App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router';
// import LoginForm from './components/auth/LoginForm'
import { ProtectedRoute } from './infrastructure/authentication/ProtectedRoute';
import LogGroup from './pages/LogGroup';
import ExportStreamsToS3 from './pages/ExportStreamsToS3';
import BucketDetail from '../../renderer/src/components/layout/BucketDetail';
import ObjectDetail from './components/layout/ObjectDetail';
import Layout from './components/layout/Layout';
import { ThemeProvider } from '@primer/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const App: React.FC<unknown> = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes>
          {/* <Route path="/login" element={<LoginForm />} /> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
          {/* <Route
          path="/log-group"
          element={
            <ProtectedRoute>
              <LogGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/export-streams"
          element={
            <ProtectedRoute>
              <ExportStreamsToS3 />
            </ProtectedRoute>
          }
        /> */}
          <Route path="/bucket/:bucketName" element={<BucketDetail />} />
          <Route
            path="/buckets/:bucketName/objects/*"
            element={<ObjectDetail />}
          />
        </Routes>
        {/* </AuthProvider> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
