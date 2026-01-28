import { useState } from "react";

const  Header=() =>{
  const [repoUrl, setRepoUrl] = useState("");

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
    console.log("Analyze repo:", repoUrl);
    // later: send to backend
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">RepoLens</h1>
          <span className="text-sm text-gray-500">
            Static GitHub Repository Analysis
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold leading-tight">
          Understand GitHub Repositories  
          <span className="block text-blue-600 mt-2">
            Beyond Stars and README
          </span>
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Analyze project structure, responsibility separation, and architectural
          signals using deterministic static code analysis — not AI guesses.
        </p>

        {/* Input */}
        <div className="mt-10 flex gap-3">
          <input
            type="url"
            placeholder="Paste GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Public repositories only. No code is stored permanently.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-12">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border">
              <h4 className="font-semibold text-lg">1. Clone Repository</h4>
              <p className="mt-2 text-sm text-gray-600">
                The backend securely clones the GitHub repository to analyze
                real project files, not metadata.
              </p>
            </div>

            <div className="p-6 rounded-lg border">
              <h4 className="font-semibold text-lg">2. Static Code Analysis</h4>
              <p className="mt-2 text-sm text-gray-600">
                Source files are parsed into ASTs and inspected for structural
                and architectural signals.
              </p>
            </div>

            <div className="p-6 rounded-lg border">
              <h4 className="font-semibold text-lg">3. Structure Report</h4>
              <p className="mt-2 text-sm text-gray-600">
                You get an objective report highlighting separation of concerns,
                complexity risks, and structural consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What It Evaluates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-10">
            What This Tool Evaluates
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-gray-700">
              <li>• UI vs logic vs service responsibility separation</li>
              <li>• Folder coherence and intent consistency</li>
              <li>• Entry-point hygiene</li>
              <li>• Structural scale readiness</li>
            </ul>
            <ul className="space-y-3 text-gray-700">
              <li>• Network & side-effect placement</li>
              <li>• Framework-aware conventions</li>
              <li>• Mixed-concern detection</li>
              <li>• Repo-size normalized expectations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
          <span>Built for engineers and recruiters</span>
          <span>Static analysis • No execution • No AI guessing</span>
        </div>
      </footer>
    </div>
  );
}
export default Header;