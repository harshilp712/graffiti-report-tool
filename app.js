const { createClient } = window.supabase;
const supabaseUrl = 'https://uikicjpnnsvpozfbcxac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpa2ljanBubnN2cG96ZmJjeGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzIzOTcsImV4cCI6MjA3MDAwODM5N30.oM_EH5QNnXTNwPyN9SbLpQb5XAzY1oD8oLTv_dfdZKs';
const supabaseClient = createClient(supabaseUrl, supabaseKey);
const supabase = supabaseClient; // optional alias for convenience

// Auth handlers
document.getElementById('sign-up-btn').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert('Sign-up error: ' + error.message);
  alert('Sign-up successful! Please check your email to confirm.');
});

document.getElementById('sign-in-btn').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert('Login error: ' + error.message);
  loadUser();
});

document.getElementById('sign-out-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    document.getElementById('user-info').textContent = `Logged in as: ${user.email}`;
    document.getElementById('sign-in-btn').style.display = 'none';
    document.getElementById('sign-up-btn').style.display = 'none';
    document.getElementById('sign-out-btn').style.display = 'inline-block';
    document.getElementById('auth-email').style.display = 'none';
    document.getElementById('auth-password').style.display = 'none';
    loadReports();
  }
}

document.getElementById('report-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('image').files[0];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("You must be logged in to submit a report.");

  let imageUrl = null;

  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('graffiti-images')
      .upload(fileName, imageFile);

    if (uploadError) return alert('Image upload failed: ' + uploadError.message);

    const { data: publicUrl } = supabase.storage
      .from('graffiti-images')
      .getPublicUrl(fileName);

    imageUrl = publicUrl.publicUrl;
  }

  const { error: insertError } = await supabase
    .from('graffiti_reports')
    .insert([{
      location,
      description,
      image_url: imageUrl,
      user_email: user.email
    }]);

  if (insertError) {
    alert('Error saving report: ' + insertError.message);
  } else {
    alert('Report submitted!');
    document.getElementById('report-form').reset();
    loadReports();
  }
});

async function loadReports() {
  const { data, error } = await supabase
    .from('graffiti_reports')
    .select('*')
    .order('created_at', { ascending: false });

  const reportsContainer = document.getElementById('reports-container');
  reportsContainer.innerHTML = '';

  if (error) {
    console.error('Failed to load reports:', error);
    return;
  }

  data.forEach(report => {
    const card = document.createElement('div');
    card.classList.add('report-card');
    card.innerHTML = `
      <h3>${report.location}</h3>
      <p>${report.description}</p>
      ${report.image_url ? `<img src="${report.image_url}" alt="Graffiti Image">` : ''}
    `;
    reportsContainer.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', loadUser);