import pptx
import os

input_pptx = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\03_PRESENTATION\DRVLIFE_MCA_PROJECT_PRESENTATION.pptx")
output_pptx = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\03_PRESENTATION\DRVLIFE_MCA_PROJECT_PRESENTATION_FINAL_QC.pptx")

prs = pptx.Presentation(input_pptx)
print(f"Loaded presentation with {len(prs.slides)} slides.")

replacements = [
    ("• Android: Jetpack Compose, Room SQLite, ViewModel, Coroutines.",
     "• Android: Jetpack Compose, ViewModel, Coroutines, StateFlow."),
    ("• Local Database: Android Room (SQLite)",
     "• Client Storage: Android filesDir (Images) & Firestore Offline Cache"),
    ("• Room Persistence: Offline SQLite caching with coroutine Dispatchers.IO.",
     "• Offline Resilience: Firestore SDK disk persistence with coroutine Dispatchers.IO."),
    ("• TransactionRepository.kt: Offline Room sync and Firestore snapshot listeners.",
     "• TransactionRepository.kt: Real-time Firestore snapshot listeners & local metadata synchronization.")
]

for idx, slide in enumerate(prs.slides):
    for shape in slide.shapes:
        if shape.has_text_frame:
            for p in shape.text_frame.paragraphs:
                for old_text, new_text in replacements:
                    if old_text in p.text:
                        p.text = p.text.replace(old_text, new_text)
                        print(f"Updated Slide {idx+1}: {new_text}")

prs.save(output_pptx)
print(f"SUCCESS: Saved corrected presentation to: {output_pptx}")

